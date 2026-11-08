const express = require('express');
const router = express.Router();
const { createFD, getMyFDs } = require('../controllers/fdController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createFD);
router.get('/', protect, getMyFDs);

module.exports = router;
