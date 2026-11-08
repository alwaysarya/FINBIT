const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit', 'transfer'], required: true },
    mode: { type: String, enum: ['UPI', 'NEFT', 'IMPS', 'Internal'], default: 'Internal' }, // NAYA
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
