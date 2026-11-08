const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['login', 'reset'], default: 'login' },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 5 min me delete
});

module.exports = mongoose.model('OTP', otpSchema);
