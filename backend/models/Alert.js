
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'delivered'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
