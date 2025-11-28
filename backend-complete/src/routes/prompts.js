const express = require('express');
const prisma = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Submit a new prompt
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { text, metadata } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    // Create prompt
    const prompt = await prisma.prompt.create({
      data: {
        text: text.trim(),
        userId: req.user.id,
        metadata: metadata || {},
      }
    });

    // Create app record
    const app = await prisma.app.create({
      data: {
        name: `App ${Date.now()}`, // Temporary name
        userId: req.user.id,
        promptId: prompt.id,
        status: 'PLANNING',
      },
      include: {
        prompt: true,
      }
    });

    res.status(201).json({
      message: 'Prompt submitted successfully',
      app: {
        id: app.id,
        name: app.name,
        status: app.status,
        prompt: {
          id: prompt.id,
          text: prompt.text,
        },
        createdAt: app.createdAt,
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all prompts for current user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const prompts = await prisma.prompt.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        app: {
          select: {
            id: true,
            name: true,
            status: true,
          }
        }
      }
    });

    res.json({ prompts });
  } catch (error) {
    next(error);
  }
});

// Get single prompt
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      include: {
        app: true,
      }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    res.json({ prompt });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
