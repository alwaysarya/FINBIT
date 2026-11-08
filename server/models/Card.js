const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cardNumber: { type: String, required: true }, // 16 digit
    cvv: { type: String, required: true },
    expiry: { type: String, required: true }, // MM/YY
    isFrozen: { type: Boolean, default: false },
    cardType: { type: String, default: 'Visa Platinum' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
