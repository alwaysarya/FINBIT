const express = require('express');
const router = express.Router();
const { getRewards, redeemPoints } = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRewards);
router.post('/redeem', protect, redeemPoints);

module.exports = router;
