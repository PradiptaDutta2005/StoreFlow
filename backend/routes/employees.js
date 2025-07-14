
const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// GET /api/employees - Fetch all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/employees/:employeeId - Fetch employee by ID
router.get('/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this ID already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/employees/:employeeId - Update employee
router.put('/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/employees/:employeeId - Delete employee
router.delete('/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// routes/employees.js
// routes/employees.js
router.post('/login', async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 🛑 If you're NOT using bcrypt:
    if (employee.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Success
    res.json({
      employeeId: employee.employeeId,
      name: employee.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
