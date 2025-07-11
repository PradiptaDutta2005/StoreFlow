
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  phoneNumber: {
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
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  orderHistory: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
