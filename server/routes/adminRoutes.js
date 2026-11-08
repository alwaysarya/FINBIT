const express = require('express');
const router = express.Router();
const { getAllUsers, toggleAccountFreeze, getAllTickets, replyToTicket, getAllLoans } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/users', protect, getAllUsers);
router.put('/accounts/:id/freeze', protect, toggleAccountFreeze);
router.get('/tickets', protect, getAllTickets); // <-- Naya
router.put('/tickets/:id/reply', protect, replyToTicket); // <-- Naya
router.get('/loans', protect, getAllLoans); // <-- Naya

module.exports = router;
