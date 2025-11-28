const express = require('express');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all builds for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const builds = await prisma.build.findMany({
      where: {
        app: {
          userId: req.user.id
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        app: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    res.json({ builds });
  } catch (error) {
    next(error);
  }
});

// Get single build
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const build = await prisma.build.findFirst({
      where: {
        id: req.params.id,
        app: {
          userId: req.user.id
        }
      },
      include: {
        app: {
          select: {
            id: true,
            name: true,
          }
        },
        logs: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!build) {
      return res.status(404).json({ error: 'Build not found' });
    }

    res.json({ build });
  } catch (error) {
    next(error);
  }
});

// Create new build (trigger build)
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { appId, platform, buildType } = req.body;

    // Validation
    if (!appId || !platform) {
      return res.status(400).json({ 
        error: 'appId and platform are required',
        validPlatforms: ['ANDROID', 'IOS', 'BOTH']
      });
    }

    // Verify app ownership
    const app = await prisma.app.findFirst({
      where: {
        id: appId,
        userId: req.user.id,
      }
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Check if app is ready for build
    if (app.status !== 'READY' && app.status !== 'GENERATING') {
      return res.status(400).json({ 
        error: 'App is not ready for build',
        currentStatus: app.status
      });
    }

    // Get latest build number
    const latestBuild = await prisma.build.findFirst({
      where: { appId },
      orderBy: { buildNumber: 'desc' }
    });

    const buildNumber = (latestBuild?.buildNumber || 0) + 1;

    // Create build record
    const build = await prisma.build.create({
      data: {
        appId,
        platform,
        buildType: buildType || 'DEBUG',
        status: 'QUEUED',
        buildNumber,
      },
      include: {
        app: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // TODO: Queue build job to SQS

    res.status(201).json({
      message: 'Build queued successfully',
      build
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
