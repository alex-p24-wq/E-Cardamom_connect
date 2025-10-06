import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Hub from "../models/Hub.js";

const router = express.Router();

// Get all active hubs (public endpoint for farmers)
router.get('/', async (req, res) => {
  try {
    const { state, district } = req.query;
    
    let query = { isActive: true };
    
    if (state) {
      query.state = state;
    }
    
    if (district) {
      query.district = district;
    }
    
    const hubs = await Hub.find(query)
      .select('name state district address contactPerson phone email services operatingHours')
      .sort({ name: 1 });
    
    res.json(hubs);
  } catch (error) {
    console.error('Get hubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hubs by district (specific endpoint for farmers)
router.get('/by-district/:state/:district', async (req, res) => {
  try {
    const { state, district } = req.params;
    
    const hubs = await Hub.find({ 
      state: state, 
      district: district, 
      isActive: true 
    })
    .select('name address contactPerson phone services')
    .sort({ name: 1 });
    
    res.json(hubs);
  } catch (error) {
    console.error('Get hubs by district error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new hub (admin/hub manager only)
router.post('/', requireAuth, requireRole(['admin', 'hub']), async (req, res) => {
  try {
    const {
      name,
      state,
      district,
      address,
      contactPerson,
      phone,
      email,
      capacity,
      services,
      operatingHours
    } = req.body;

    // Validate required fields
    if (!name || !state || !district || !address) {
      return res.status(400).json({ 
        message: 'Name, state, district, and address are required' 
      });
    }

    // Check if hub with same name exists in the same district
    const existingHub = await Hub.findOne({ 
      name: name.trim(), 
      state: state.trim(), 
      district: district.trim() 
    });
    
    if (existingHub) {
      return res.status(400).json({ 
        message: 'A hub with this name already exists in this district' 
      });
    }

    const hub = new Hub({
      name: name.trim(),
      state: state.trim(),
      district: district.trim(),
      address: address.trim(),
      contactPerson: contactPerson?.trim(),
      phone: phone?.trim(),
      email: email?.trim(),
      capacity: capacity || 0,
      services: services || [],
      operatingHours: operatingHours?.trim(),
      registeredBy: req.user._id
    });

    await hub.save();
    res.status(201).json(hub);
  } catch (error) {
    console.error('Create hub error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update hub (admin/hub manager only)
router.put('/:id', requireAuth, requireRole(['admin', 'hub']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.registeredBy;
    delete updateData.createdAt;
    
    const hub = await Hub.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!hub) {
      return res.status(404).json({ message: 'Hub not found' });
    }

    res.json(hub);
  } catch (error) {
    console.error('Update hub error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete/Deactivate hub (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Instead of deleting, we deactivate the hub
    const hub = await Hub.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!hub) {
      return res.status(404).json({ message: 'Hub not found' });
    }

    res.json({ message: 'Hub deactivated successfully' });
  } catch (error) {
    console.error('Delete hub error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all hubs for admin management
router.get('/admin/all', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, state, district, isActive } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (state) query.state = state;
    if (district) query.district = district;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const [hubs, total] = await Promise.all([
      Hub.find(query)
        .populate('registeredBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Hub.countDocuments(query)
    ]);
    
    res.json({
      hubs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get all hubs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hub statistics
router.get('/stats', requireAuth, requireRole(['admin', 'hub']), async (req, res) => {
  try {
    const [totalHubs, activeHubs, stateStats] = await Promise.all([
      Hub.countDocuments(),
      Hub.countDocuments({ isActive: true }),
      Hub.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);
    
    res.json({
      totalHubs,
      activeHubs,
      inactiveHubs: totalHubs - activeHubs,
      topStates: stateStats
    });
  } catch (error) {
    console.error('Get hub stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
