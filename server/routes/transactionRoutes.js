const express = require('express');
const router = express.Router();
const { transferMoney, depositMoney, payBill } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/transfer', protect, transferMoney);
router.post('/deposit', protect, depositMoney);
router.post('/pay-bill', protect, payBill); // <-- Naya Route

module.exports = router;
