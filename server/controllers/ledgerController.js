const Ledger = require('../models/Ledger');

// @desc    Get my ledger entries (Debit/Credit list)
// @route   GET /api/ledger
const getMyLedger = async (req, res, next) => {
  try {
    // User ke saare accounts ke ledger entries nikalne ke liye
    const Account = require('../models/Account');
    const accounts = await Account.find({ user: req.user._id }).select('_id');
    const accountIds = accounts.map(a => a._id);

    const entries = await Ledger.find({ account: { $in: accountIds } })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(entries);
  } catch (error) { next(error); }
};

module.exports = { getMyLedger };
