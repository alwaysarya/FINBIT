const express = require('express');
const router = express.Router();
const { createGoal, getGoals, addMoneyToGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createGoal);
router.get('/', protect, getGoals);
router.put('/:id/add', protect, addMoneyToGoal);

module.exports = router;
