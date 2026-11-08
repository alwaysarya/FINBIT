const express = require('express');
const router = express.Router();
const { getMyCard, toggleFreeze } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyCard);
router.put('/freeze', protect, toggleFreeze);

module.exports = router;
