const express = require('express');
const router = express.Router();
const { createRequest, getIncomingRequests, payRequest, rejectRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/incoming', protect, getIncomingRequests);
router.post('/:id/pay', protect, payRequest);
router.post('/:id/reject', protect, rejectRequest);

module.exports = router;
