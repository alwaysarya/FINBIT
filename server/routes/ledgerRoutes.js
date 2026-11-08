const express = require('express');
const router = express.Router();
const { getMyLedger } = require('../controllers/ledgerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyLedger);

module.exports = router;
