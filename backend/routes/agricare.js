import express from "express";

const router = express.Router();

// Get all agricare providers
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'AgriCare routes working' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;