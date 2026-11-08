const express = require('express');
const router = express.Router();
const { getMyAccount, getMyTransactions, getRecentContacts, getNotifications, markNotificationRead, openNewAccount } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyAccount);
router.get('/transactions', protect, getMyTransactions);
router.get('/contacts', protect, getRecentContacts);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.post('/open', protect, openNewAccount); // <-- Naya

module.exports = router;
