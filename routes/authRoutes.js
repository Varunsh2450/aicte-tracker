const express = require('express');
const router = express.Router();
const { register, login, getMe, markNotificationsRead, getLeaderboard, getAllStudents, updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes (requires valid token)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/leaderboard', protect, getLeaderboard);
router.put('/notifications/read', protect, markNotificationsRead);

// Teacher/Admin routes
router.get('/students', protect, authorize('Teacher', 'Admin'), getAllStudents);

module.exports = router;
