// insertEmployees.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');

// ⚠️ Replace this with your actual MongoDB connection string
const MONGODB_URI = 'mongodb://127.0.0.1:27017/blue-retail-compass';


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const employees = [
  { employeeId: 'emp001', name: 'Aakash Mehta', password: 'emp001pass' },
  { employeeId: 'emp002', name: 'Priya Sharma', password: 'emp002pass' },
  { employeeId: 'emp003', name: 'Rahul Verma', password: 'emp003pass' },
  { employeeId: 'emp004', name: 'Neha Kapoor', password: 'emp004pass' },
  { employeeId: 'emp005', name: 'Rohan Das', password: 'emp005pass' },
  { employeeId: 'emp006', name: 'Anjali Singh', password: 'emp006pass' },
  { employeeId: 'emp007', name: 'Deepak Joshi', password: 'emp007pass' },
  { employeeId: 'emp008', name: 'Sneha Rao', password: 'emp008pass' },
  { employeeId: 'emp009', name: 'Vikram Chauhan', password: 'emp009pass' },
  { employeeId: 'emp010', name: 'Tanya Iyer', password: 'emp010pass' }
];

async function insertEmployees() {
  try {
    for (let emp of employees) {
      const hashed = await bcrypt.hash(emp.password, 10);
      await Employee.create({
        employeeId: emp.employeeId,
        name: emp.name,
        password: hashed
      });
    }

    console.log('✅ All employees inserted successfully!');
  } catch (err) {
    console.error('❌ Error inserting employees:', err);
  } finally {
    mongoose.disconnect();
  }
}

insertEmployees();
