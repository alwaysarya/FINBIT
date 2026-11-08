const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loanType: { type: String, enum: ['personal', 'home', 'vehicle', 'education'], required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true }, // e.g. 10.5%
    tenureMonths: { type: Number, required: true },
    emi: { type: Number, required: true },
    totalPayable: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'closed'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', loanSchema);
