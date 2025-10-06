import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

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

// Get hub stats
router.get('/stats', requireAuth, requireRole('hub'), async (req, res) => {
  try {
    const { default: Product } = await import('../models/Product.js');
    const { default: Order } = await import('../models/Order.js');
    const { default: User } = await import('../models/User.js');
    
    // Get all products (hub manages all inventory)
    const products = await Product.find({});
    const totalInventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    
    // Get pending shipments (orders that are processing or shipped)
    const pendingShipments = await Order.countDocuments({ 
      status: { $in: ['Processing', 'Shipped'] } 
    });
    
    // Get registered farmers
    const registeredFarmers = await User.countDocuments({ role: 'farmer' });
    
    // Get active customers
    const activeCustomers = await User.countDocuments({ role: 'customer' });
    
    res.json({
      totalInventory,
      pendingShipments,
      registeredFarmers,
      activeCustomers
    });
  } catch (error) {
    console.error('Get hub stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hub inventory
router.get('/inventory', requireAuth, requireRole('hub'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (page - 1) * limit;
    
    const { default: Product } = await import('../models/Product.js');
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      items: products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get hub inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hub shipments
router.get('/shipments', requireAuth, requireRole('hub'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const { default: Order } = await import('../models/Order.js');
    
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('customer', 'username email')
      .populate('items.product', 'name grade')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      items: orders,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get hub shipments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hub farmers
router.get('/farmers', requireAuth, requireRole('hub'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const { default: User } = await import('../models/User.js');
    
    const farmers = await User.find({ role: 'farmer' })
      .select('username email phone profile createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments({ role: 'farmer' });
    
    res.json({
      items: farmers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get hub farmers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;