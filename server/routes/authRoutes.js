const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { resetPasswordDirect } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/reset-password-direct', resetPasswordDirect); // <-- Naya

module.exports = router;
