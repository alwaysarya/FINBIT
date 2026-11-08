const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Get user's reward points
// @route   GET /api/rewards
const getRewards = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('rewardPoints');
    res.json(user);
  } catch (error) { next(error); }
};

// @desc    Redeem points (100 points = ₹10)
// @route   POST /api/rewards/redeem
const redeemPoints = async (req, res, next) => {
  try {
    const { pointsToRedeem } = req.body;
    if (!pointsToRedeem || pointsToRedeem < 100) { res.status(400); throw new Error('Minimum 100 points required to redeem'); }

    const user = await User.findById(req.user._id);
    if (user.rewardPoints < pointsToRedeem) { res.status(400); throw new Error('Insufficient points'); }

    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }

    // Conversion rate: 10 points = ₹1
    const cashAmount = pointsToRedeem / 10;

    user.rewardPoints -= pointsToRedeem;
    await user.save();

    account.balance += cashAmount;
    await account.save();

    // Transaction history me dikhne ke liye
    await Transaction.create({ toAccount: account._id, amount: cashAmount, type: 'credit', status: 'success', description: `Reward Redemption (${pointsToRedeem} points)` });
    
    // Notification
    await Notification.create({ user: user._id, title: 'Points Redeemed', message: `${pointsToRedeem} points converted to ₹${cashAmount}.` });

    res.json({ message: `${pointsToRedeem} points redeemed for ₹${cashAmount}`, newBalance: account.balance, newPoints: user.rewardPoints });
  } catch (error) { next(error); }
};

module.exports = { getRewards, redeemPoints };
