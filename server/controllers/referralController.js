const User = require('../models/User');

const getReferralStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const referrals = await User.find({ referredBy: req.user._id }).select('name createdAt');
    
    res.json({
      referralCode: user.referralCode,
      totalReferrals: referrals.length,
      earnings: referrals.length * 100,
      referrals,
    });
  } catch (error) { next(error); }
};

module.exports = { getReferralStats };
