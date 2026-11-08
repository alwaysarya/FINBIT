const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getLoginHistory } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSettings);
router.put('/', protect, updateSettings);
router.get('/login-history', protect, getLoginHistory);

module.exports = router;
