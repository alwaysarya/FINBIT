const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, default: 'FINBIT' },
    nickname: { type: String, default: '' },
  },
  { timestamps: true }
);

// Ek user ek account number ko ek hi baar save kar sakta hai
beneficiarySchema.index({ user: 1, accountNumber: 1 }, { unique: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
