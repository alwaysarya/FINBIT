const User = require('../models/User');
const LoginHistory = require('../models/LoginHistory');

// Settings fetch karo
const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    res.json(user.settings || { notifications: true, darkMode: true, twoFactor: false });
  } catch (error) { next(error); }
};

// Settings update karo
const updateSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.settings = { ...user.settings, ...req.body };
    await user.save();
    res.json({ message: 'Settings saved', settings: user.settings });
  } catch (error) { next(error); }
};

// Login History fetch karo
const getLoginHistory = async (req, res, next) => {
  try {
    const history = await LoginHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) { next(error); }
};

module.exports = { getSettings, updateSettings, getLoginHistory };
