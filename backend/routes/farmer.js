import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Product from "../models/Product.js";

const router = express.Router();

// Basic sanity check
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Farmer routes working' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (farmer only)
router.post('/products', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { name, price, stock, grade, image, address, experienceYears, description } = req.body;
    if (!name || price == null || stock == null || !grade) {
      return res.status(400).json({ message: 'name, price, stock, grade are required' });
    }

    const product = await Product.create({
      user: req.user._id,
      name,
      price,
      stock,
      grade,
      image,
      address,
      experienceYears,
      description,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// List current farmer products
router.get('/products/mine', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('List my products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', requireAuth, requireRole('farmer'), async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Product.findOneAndDelete({ _id: id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;