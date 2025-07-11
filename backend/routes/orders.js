
const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// GET /api/orders - Fetch all orders with optional filters
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter by customer ID
    if (req.query.customerId) {
      query.customerId = req.query.customerId;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.orderDate = {};
      if (req.query.startDate) {
        query.orderDate.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.orderDate.$lte = new Date(req.query.endDate);
      }
    }
    
    const orders = await Order.find(query).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:orderId - Fetch order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Order with this ID already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/orders/:orderId - Update order
router.put('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/orders/:orderId - Delete order
router.delete('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
