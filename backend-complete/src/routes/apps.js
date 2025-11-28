const express = require('express');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all apps for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const apps = await prisma.app.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        prompt: {
          select: {
            id: true,
            text: true,
          }
        },
        builds: {
          select: {
            id: true,
            platform: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      }
    });

    res.json({ apps });
  } catch (error) {
    next(error);
  }
});

// Get single app
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const app = await prisma.app.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        prompt: true,
        builds: {
          orderBy: { createdAt: 'desc' },
        }
      }
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({ app });
  } catch (error) {
    next(error);
  }
});

// Update app
router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Verify ownership
    const existingApp = await prisma.app.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      }
    });

    if (!existingApp) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Update app
    const app = await prisma.app.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
      include: {
        prompt: true,
      }
    });

    res.json({
      message: 'App updated successfully',
      app
    });
  } catch (error) {
    next(error);
  }
});

// Delete app
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    // Verify ownership
    const app = await prisma.app.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      }
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    // Delete app (cascade will delete related builds)
    await prisma.app.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
