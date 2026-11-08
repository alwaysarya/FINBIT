const express = require('express');
const router = express.Router();
const { createRecurring, getRecurrings, cancelRecurring } = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRecurring);
router.get('/', protect, getRecurrings);
router.put('/:id/cancel', protect, cancelRecurring);

module.exports = router;
