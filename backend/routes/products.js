
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products - Fetch all products with optional search
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Search by name
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: 'i' };
    }
    
    // Search by category
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:productId - Fetch product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this ID already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:productId - Update product
router.put('/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:productId - Delete product
router.delete('/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
