
const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// GET /api/customers - Fetch all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/customers/:phoneNumber - Fetch customer by phone number
router.get('/:phoneNumber', async (req, res) => {
  try {
    const customer = await Customer.findOne({ phoneNumber: req.params.phoneNumber });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Customer with this phone number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/customers/:phoneNumber - Update customer
router.put('/:phoneNumber', async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { phoneNumber: req.params.phoneNumber },
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/customers/:phoneNumber - Delete customer
router.delete('/:phoneNumber', async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ phoneNumber: req.params.phoneNumber });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
