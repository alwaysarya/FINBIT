const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jisko paisa chahiye
    payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jisko paisa dena hai
    amount: { type: Number, required: true },
    note: { type: String, default: 'Payment Request' },
    status: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentRequest', requestSchema);
