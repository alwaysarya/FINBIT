const express = require('express');
const router = express.Router();
const { generateUpiId, getUpiId } = require('../controllers/upiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateUpiId);
router.get('/', protect, getUpiId);

module.exports = router;
