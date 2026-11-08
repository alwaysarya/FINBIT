const express = require('express');
const router = express.Router();
const { createSchedule, getSchedules, cancelSchedule } = require('../controllers/scheduledController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSchedule);
router.get('/', protect, getSchedules);
router.put('/:id/cancel', protect, cancelSchedule);

module.exports = router;
