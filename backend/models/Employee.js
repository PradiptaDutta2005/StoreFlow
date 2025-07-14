const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  alerts: [{
    alertId: String,
    message: String,
    timestamp: Date,
    status: {
      type: String,
      enum: ['pending', 'delivered'],
      default: 'pending'
    }
  }]
}, {
  timestamps: true
});

// 🔒 Optional: Enable later for password hashing
/*
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
*/

module.exports = mongoose.model('Employee', employeeSchema);
