const PaymentRequest = require('../models/PaymentRequest');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');

// @desc    Payment Request bhejo (Paisa maango)
// @route   POST /api/request
const createRequest = async (req, res, next) => {
  try {
    const { payerAccountNumber, amount, note } = req.body;
    if (!payerAccountNumber || !amount) { res.status(400); throw new Error('Payer account and amount required'); }

    // Payer ka account dhoondo
    const payerAccount = await Account.findOne({ accountNumber: payerAccountNumber });
    if (!payerAccount) { res.status(404); throw new Error('Payer account not found'); }
    if (payerAccount.user.toString() === req.user._id.toString()) { res.status(400); throw new Error('Cannot request money from yourself'); }

    const request = await PaymentRequest.create({
      requester: req.user._id, payer: payerAccount.user, amount: Number(amount), note,
    });

    // Notification payer ko bhejo
    await Notification.create({ user: payerAccount.user, title: 'New Payment Request', message: `You have a payment request of ₹${amount} from A/C ${req.user.accountNumber || 'someone'}.` });

    res.status(201).json({ message: 'Request sent!', request });
  } catch (error) { next(error); }
};

// @desc    Mere paas aayi requests dekho
// @route   GET /api/request/incoming
const getIncomingRequests = async (req, res, next) => {
  try {
    const requests = await PaymentRequest.find({ payer: req.user._id, status: 'pending' }).populate('requester', 'name email');
    res.json(requests);
  } catch (error) { next(error); }
};

// @desc    Request Accept/Pay karo
// @route   POST /api/request/:id/pay
const payRequest = async (req, res, next) => {
  try {
    const request = await PaymentRequest.findById(req.params.id);
    if (!request) { res.status(404); throw new Error('Request not found'); }
    if (request.status !== 'pending') { res.status(400); throw new Error('Request already processed'); }

    const payerAccount = await Account.findOne({ user: req.user._id });
    const requesterAccount = await Account.findOne({ user: request.requester });

    if (!payerAccount || !requesterAccount) { res.status(404); throw new Error('Account not found'); }
    if (payerAccount.balance < request.amount) { res.status(400); throw new Error('Insufficient balance'); }

    // Transfer paisa
    payerAccount.balance -= request.amount;
    requesterAccount.balance += request.amount;
    await payerAccount.save();
    await requesterAccount.save();

    request.status = 'paid';
    await request.save();

    // Transactions
    await Transaction.create({
      fromAccount: payerAccount._id, toAccount: requesterAccount._id, amount: request.amount, type: 'transfer', status: 'success', description: `Payment to Request`,
    });

    await Notification.create([
      { user: request.requester, title: 'Request Paid', message: `Your request for ₹${request.amount} was paid.` },
      { user: req.user._id, title: 'Payment Sent', message: `You paid ₹${request.amount} for a request.` }
    ]);

    res.json({ message: 'Payment successful', newBalance: payerAccount.balance });
  } catch (error) { next(error); }
};

// @desc    Request Reject karo
// @route   POST /api/request/:id/reject
const rejectRequest = async (req, res, next) => {
  try {
    const request = await PaymentRequest.findById(req.params.id);
    if (!request) { res.status(404); throw new Error('Request not found'); }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected' });
  } catch (error) { next(error); }
};

module.exports = { createRequest, getIncomingRequests, payRequest, rejectRequest };
