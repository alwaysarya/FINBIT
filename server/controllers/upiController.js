const User = require('../models/User');

// @desc    Generate UPI ID for user
// @route   POST /api/upi/generate
const generateUpiId = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }

    if (user.upiId) {
      return res.status(400).json({ message: 'UPI ID already exists', upiId: user.upiId });
    }

    // Create a UPI ID from user's name (e.g. aryan@finbit)
    const baseName = user.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const upiId = `${baseName}${randomNum}@finbit`;

    user.upiId = upiId;
    await user.save();

    res.status(201).json({ message: 'UPI ID created successfully', upiId });
  } catch (error) { next(error); }
};

// @desc    Get user's UPI ID
// @route   GET /api/upi
const getUpiId = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ upiId: user.upiId || null });
  } catch (error) { next(error); }
};

module.exports = { generateUpiId, getUpiId };
