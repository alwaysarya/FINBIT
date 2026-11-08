const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/mark-all-read', protect, markAllAsRead);
router.delete('/clear-all', protect, clearAll);

module.exports = router;
