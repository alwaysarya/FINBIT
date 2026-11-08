const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Account = require('../models/Account');
const generateToken = require('../utils/generateToken');

const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) { res.status(400); throw new Error('Please provide name, email and password'); }
    const userExists = await User.findOne({ email });
    if (userExists) { res.status(400); throw new Error('User already exists'); }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword, phone: phone || '' });
    const account = await Account.create({ user: user._id, accountNumber: generateAccountNumber(), balance: 10000, accountType: 'savings' });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      account: { _id: account._id, accountNumber: account.accountNumber, balance: account.balance, accountType: account.accountType },
      token: generateToken(user._id),
    });
  } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }
    const user = await User.findOne({ email });
    if (!user) { res.status(401); throw new Error('Invalid credentials'); }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { res.status(401); throw new Error('Invalid credentials'); }
    const account = await Account.findOne({ user: user._id });
    res.json({
      _id: user._id, name: user.name, email: user.email, phone: user.phone,
      account: account ? { _id: account._id, accountNumber: account.accountNumber, balance: account.balance, accountType: account.accountType } : null,
      token: generateToken(user._id),
    });
  } catch (error) { next(error); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const account = await Account.findOne({ user: req.user._id });
    res.json({ user, account });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone });
  } catch (error) { next(error); }
};

// NAYA: Password Change Function
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) { res.status(400); throw new Error('Please provide both passwords'); }
    
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) { res.status(401); throw new Error('Current password is incorrect'); }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) { next(error); }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword };
