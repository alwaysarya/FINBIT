const express = require('express');
const router = express.Router();
const { createRD, getMyRDs } = require('../controllers/rdController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createRD);
router.get('/', protect, getMyRDs);

module.exports = router;
