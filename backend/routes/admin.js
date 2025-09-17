import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require admin role
router.use(requireAuth, requireRole('admin'));

// Health / summary
router.get('/', async (_req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
    ]);
    res.json({ message: 'Admin routes working', stats: { users, products, orders } });
  } catch (error) {
    console.error('Admin root error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users: list with optional role filter and pagination
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (q) {
      const re = new RegExp(String(q), 'i');
      filter.$or = [{ username: re }, { email: re }, { phone: re }];
    }
    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * lim;
    const [items, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).select('-password'),
      User.countDocuments(filter)
    ]);
    res.json({ items, total, page: parseInt(page, 10) || 1, limit: lim });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users: update role or basic fields
router.patch('/users/:id', async (req, res) => {
  try {
    // Prevent changing role of an admin user
    if ('role' in req.body) {
      const target = await User.findById(req.params.id).select('role');
      if (!target) return res.status(404).json({ message: 'User not found' });
      if (target.role === 'admin' && req.body.role !== 'admin') {
        return res.status(400).json({ message: 'Cannot change role of an admin user' });
      }
    }

    const allowed = ['role', 'phone', 'profileData'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products: list with search and pagination
router.get('/products', async (req, res) => {
  try {
    const { q, page = 1, limit = 20, userId } = req.query;
    const filter = {};
    if (q) {
      const re = new RegExp(String(q), 'i');
      filter.$or = [{ name: re }, { description: re }, { address: re }];
    }
    if (userId) filter.user = userId;
    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * lim;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).populate('user', 'username role'),
      Product.countDocuments(filter)
    ]);
    res.json({ items, total, page: parseInt(page, 10) || 1, limit: lim });
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products: update fields
router.patch('/products/:id', async (req, res) => {
  try {
    const allowed = ['name', 'price', 'stock', 'grade', 'image', 'address', 'description'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders: list with status filter
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20, customerId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customerId) filter.customer = customerId;
    const lim = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * lim;
    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).populate('customer', 'username email'),
      Order.countDocuments(filter)
    ]);
    res.json({ items, total, page: parseInt(page, 10) || 1, limit: lim });
  } catch (error) {
    console.error('List orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders: update status or paymentStatus
router.patch('/orders/:id', async (req, res) => {
  try {
    const allowed = ['status', 'paymentStatus', 'notes'];
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users: get by id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users: create
router.post('/users', async (req, res) => {
  try {
    const { username, email, password, role = 'customer', phone, profileData } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'username, email, password are required' });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'User with same email or username already exists' });
    const user = await User.create({ username, email, password, role, phone, profileData });
    const safe = user.toObject();
    delete safe.password;
    res.status(201).json({ message: 'User created', user: safe });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Users: delete
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const target = await User.findById(userId).select('role');
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (target.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin user' });

    // Prevent delete if user has orders (to avoid orphan orders)
    const hasOrders = await Order.exists({ customer: userId });
    if (hasOrders) return res.status(400).json({ message: 'Cannot delete user with existing orders' });

    // Delete products owned by the user
    const deletedProducts = await Product.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted', deletedProducts: deletedProducts?.deletedCount || 0 });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products: get by id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'username role');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products: create
router.post('/products', async (req, res) => {
  try {
    const { user: ownerId, name, price, stock, grade, image, address, description } = req.body;
    if (!ownerId || !name || price == null || stock == null || !grade) {
      return res.status(400).json({ message: 'user, name, price, stock, grade are required' });
    }
    const owner = await User.findById(ownerId);
    if (!owner) return res.status(400).json({ message: 'Owner user not found' });
    const product = await Product.create({ user: ownerId, name, price, stock, grade, image, address, description });
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products: delete
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders: get by id
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'username email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Orders: delete
router.delete('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;