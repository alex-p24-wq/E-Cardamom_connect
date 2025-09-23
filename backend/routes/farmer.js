import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Product from "../models/Product.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Configure Multer storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `product-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (/^image\//.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image uploads are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Basic sanity check
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Farmer routes working' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (farmer only) with optional image upload
router.post('/products', requireAuth, requireRole('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, grade, address, experienceYears, description } = req.body;
    if (!name || price == null || stock == null || !grade) {
      return res.status(400).json({ message: 'name, price, stock, grade are required' });
    }

    // Build image URL if file uploaded
    let imageUrl = undefined;
    if (req.file) {
      // Build absolute URL so frontend can load from different origin
      const host = req.get('host');
      const protocol = req.protocol;
      imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Backward compatibility: allow URL string
      imageUrl = req.body.image.trim();
    }

    const product = await Product.create({
      user: req.user._id,
      name,
      price,
      stock,
      grade,
      image: imageUrl,
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