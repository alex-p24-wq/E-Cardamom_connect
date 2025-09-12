import express from "express";

const router = express.Router();

// Get all farmers
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Farmer routes working' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;