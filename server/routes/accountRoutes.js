const express = require('express');
const router = express.Router();
const { getMyAccount, getMyTransactions, getRecentContacts, getNotifications, markNotificationRead } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyAccount);
router.get('/transactions', protect, getMyTransactions);
router.get('/contacts', protect, getRecentContacts);
router.get('/notifications', protect, getNotifications); // <-- Naya
router.put('/notifications/:id/read', protect, markNotificationRead); // <-- Naya

module.exports = router;
