const express = require('express');
const router = express.Router();
const { applyLoan, getMyLoans, calculateEMI } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyLoan);
router.get('/', protect, getMyLoans);
router.post('/calculate', protect, calculateEMI);

module.exports = router;
