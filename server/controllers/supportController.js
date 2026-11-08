const SupportTicket = require('../models/SupportTicket');

// Naya Ticket raise karo
const createTicket = async (req, res, next) => {
  try {
    const { subject, description, category } = req.body;
    if (!subject || !description) { res.status(400); throw new Error('Please provide subject and description'); }

    const ticket = await SupportTicket.create({ user: req.user._id, subject, description, category });
    res.status(201).json({ message: 'Ticket raised successfully', ticket });
  } catch (error) { next(error); }
};

// Apne saare tickets dekho
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) { next(error); }
};

module.exports = { createTicket, getMyTickets };
