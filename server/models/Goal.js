const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    savedAmount: { type: Number, default: 0 },
    icon: { type: String, default: '🎯' }, // Jaise: 📱, 🏍️, ✈️
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
