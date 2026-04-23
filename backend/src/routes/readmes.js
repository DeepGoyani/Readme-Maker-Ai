import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { Readme } from '../database.js';

const router = express.Router();

// Get user's README history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const readmes = await Readme.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'username');

    res.json(readmes);
  } catch (error) {
    console.error('Error fetching readmes:', error.message);
    res.status(500).json({ error: 'Failed to fetch README history' });
  }
});

// Get specific README
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const readme = await Readme.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!readme) {
      return res.status(404).json({ error: 'README not found' });
    }

    res.json(readme);
  } catch (error) {
    console.error('Error fetching readme:', error.message);
    res.status(500).json({ error: 'Failed to fetch README' });
  }
});

// Update README content
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }

    const readme = await Readme.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content },
      { new: true }
    );

    if (!readme) {
      return res.status(404).json({ error: 'README not found' });
    }

    res.json(readme);
  } catch (error) {
    console.error('Error updating readme:', error.message);
    res.status(500).json({ error: 'Failed to update README' });
  }
});

// Delete README
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Readme.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({ error: 'README not found' });
    }

    res.json({ message: 'README deleted successfully' });
  } catch (error) {
    console.error('Error deleting readme:', error.message);
    res.status(500).json({ error: 'Failed to delete README' });
  }
});

export default router;
