const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    phone: { type: String, default: '' },
    rewardPoints: { type: Number, default: 100 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    upiId: { type: String, unique: true, sparse: true }, // <-- NAYA FIELD
    settings: {
      notifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      twoFactor: { type: Boolean, default: false },
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
