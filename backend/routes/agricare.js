import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";

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

// Get agricare stats
router.get('/stats', requireAuth, requireRole('agricare'), async (req, res) => {
  try {
    const { default: User } = await import('../models/User.js');
    
    // Mock data for AgriCare stats - in real app, would have AgriCare-specific models
    const farmers = await User.countDocuments({ role: 'farmer' });
    
    // Mock AgriCare products and orders
    const products = 3; // Soil Test Kit, Organic Fertilizer, Pest Control Spray
    const orders = 3; // Recent orders
    const revenue = 6794; // Total from orders
    
    res.json({
      products,
      orders,
      farmers,
      revenue
    });
  } catch (error) {
    console.error('Get agricare stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agricare products
router.get('/products', requireAuth, requireRole('agricare'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    // Mock AgriCare products - in real app, would have separate AgriCare product model
    const mockProducts = [
      { id: "P-101", name: "Soil Test Kit", price: 999, stock: 42, grade: "Premium" },
      { id: "P-102", name: "Organic Fertilizer", price: 499, stock: 120, grade: "Regular" },
      { id: "P-103", name: "Pest Control Spray", price: 299, stock: 60, grade: "Special" },
    ];
    
    let filteredProducts = mockProducts;
    if (search) {
      filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      items: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(filteredProducts.length / limit)
    });
  } catch (error) {
    console.error('Get agricare products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agricare orders
router.get('/orders', requireAuth, requireRole('agricare'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    // Mock AgriCare orders - in real app, would filter actual orders for AgriCare products
    const mockOrders = [
      { id: "O-8901", date: "2025-05-08", status: "Processing", total: 3496, items: 4 },
      { id: "O-8892", date: "2025-05-07", status: "Shipped", total: 1299, items: 1 },
      { id: "O-8871", date: "2025-05-05", status: "Delivered", total: 1999, items: 2 },
    ];
    
    let filteredOrders = mockOrders;
    if (status && status !== 'All') {
      filteredOrders = mockOrders.filter(o => o.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    res.json({
      items: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(filteredOrders.length / limit)
    });
  } catch (error) {
    console.error('Get agricare orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get agricare farmers (farmer clients)
router.get('/farmers', requireAuth, requireRole('agricare'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Mock farmer clients - in real app, would have relationship model
    const mockFarmers = [
      { id: "F-201", name: "Rahul N", location: "Idukki, KL", joined: "2024-10-12" },
      { id: "F-214", name: "Meera V", location: "Kumily, KL", joined: "2024-11-28" },
      { id: "F-225", name: "Jijo P", location: "Munnar, KL", joined: "2025-01-15" },
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFarmers = mockFarmers.slice(startIndex, endIndex);
    
    res.json({
      items: paginatedFarmers,
      total: mockFarmers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(mockFarmers.length / limit)
    });
  } catch (error) {
    console.error('Get agricare farmers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;