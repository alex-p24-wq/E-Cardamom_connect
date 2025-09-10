import express from "express";

const router = express.Router();

// Get all hub managers
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Hub Manager routes working' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;