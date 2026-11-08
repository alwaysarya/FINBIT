const User = require('../models/User');
const Account = require('../models/Account');
const SupportTicket = require('../models/SupportTicket');
const Loan = require('../models/Loan');

// Saare users dekho
const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') { res.status(403); throw new Error('Access denied. Admin only.'); }
    const users = await User.find({}).select('-password');
    const usersWithAccounts = await Promise.all(users.map(async (u) => {
      const account = await Account.findOne({ user: u._id });
      return { ...u._doc, account };
    }));
    res.json(usersWithAccounts);
  } catch (error) { next(error); }
};

// Account Freeze/Unfreeze
const toggleAccountFreeze = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') { res.status(403); throw new Error('Access denied.'); }
    const account = await Account.findById(req.params.id);
    if (!account) { res.status(404); throw new Error('Account not found'); }
    account.isFrozen = !account.isFrozen;
    await account.save();
    res.json({ message: account.isFrozen ? 'Account Frozen' : 'Account Unfrozen', isFrozen: account.isFrozen });
  } catch (error) { next(error); }
};

// NAYA: Saare Support Tickets dekho
const getAllTickets = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') { res.status(403); throw new Error('Access denied.'); }
    const tickets = await SupportTicket.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) { next(error); }
};

// NAYA: Ticket ka reply karo aur resolve karo
const replyToTicket = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') { res.status(403); throw new Error('Access denied.'); }
    const { adminReply, status } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) { res.status(404); throw new Error('Ticket not found'); }
    
    ticket.adminReply = adminReply;
    ticket.status = status || 'resolved';
    await ticket.save();
    res.json({ message: 'Ticket updated', ticket });
  } catch (error) { next(error); }
};

// NAYA: Saare Loans dekho
const getAllLoans = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') { res.status(403); throw new Error('Access denied.'); }
    const loans = await Loan.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, toggleAccountFreeze, getAllTickets, replyToTicket, getAllLoans };
