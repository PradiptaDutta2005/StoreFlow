
const express = require('express');
const Alert = require('../models/Alert');
const router = express.Router();

// GET /api/alerts - Fetch all alerts with optional employee filter
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter by employee ID
    if (req.query.employeeId) {
      query.employeeId = req.query.employeeId;
    }
    
    const alerts = await Alert.find(query).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/alerts/:alertId - Fetch alert by ID
router.get('/:alertId', async (req, res) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/alerts - Create new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Alert with this ID already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/alerts/:alertId - Update alert
router.put('/:alertId', async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { alertId: req.params.alertId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/alerts/:alertId - Delete alert
router.delete('/:alertId', async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ alertId: req.params.alertId });
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

/*router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).json({ message: 'Failed to create alert', error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const { employeeId } = req.query;
    const alerts = await Alert.find(employeeId ? { employeeId } : {});
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ message: 'Failed to fetch alerts', error: err.message });
  }
});
*/