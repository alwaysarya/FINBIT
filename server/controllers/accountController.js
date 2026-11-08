const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// Random 10-digit account number
const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const getMyAccount = async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    res.json(account);
  } catch (error) { next(error); }
};

const getMyTransactions = async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    const transactions = await Transaction.find({
      $or: [{ fromAccount: account._id }, { toAccount: account._id }],
    }).sort({ createdAt: -1 }).limit(50).populate('fromAccount', 'accountNumber').populate('toAccount', 'accountNumber');
    res.json(transactions);
  } catch (error) { next(error); }
};

const getRecentContacts = async (req, res, next) => {
  try {
    const account = await Account.findOne({ user: req.user._id });
    if (!account) { res.status(404); throw new Error('Account not found'); }
    const transactions = await Transaction.find({ fromAccount: account._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'toAccount', populate: { path: 'user', select: 'name' } });
    const contactsMap = new Map();
    transactions.forEach(txn => {
      if (txn.toAccount && txn.toAccount.user) {
        contactsMap.set(txn.toAccount.accountNumber, { name: txn.toAccount.user.name, accountNumber: txn.toAccount.accountNumber });
      }
    });
    res.json(Array.from(contactsMap.values()).slice(0, 5));
  } catch (error) { next(error); }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) { next(error); }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) { res.status(404); throw new Error('Notification not found'); }
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Marked as read' });
  } catch (error) { next(error); }
};

// NAYA: Naya Account Open karo
const openNewAccount = async (req, res, next) => {
  try {
    const { accountType } = req.body;
    if (!['savings', 'current'].includes(accountType)) { res.status(400); throw new Error('Invalid account type'); }
    
    const newAccount = await Account.create({
      user: req.user._id,
      accountNumber: generateAccountNumber(),
      balance: 0, // Naya account zero balance se start hoga
      accountType,
    });

    res.status(201).json({ message: 'New account created', account: newAccount });
  } catch (error) { next(error); }
};

module.exports = { getMyAccount, getMyTransactions, getRecentContacts, getNotifications, markNotificationRead, openNewAccount };
