const express = require('express');
const router = express.Router();
const { 
  submitActivity, 
  getMyActivities, 
  getPendingActivities,
  getHistoryActivities,
  updateActivityStatus,
  deleteActivity
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All activity routes require authentication
router.use(protect);

// Student routes
router.post('/', authorize('Student'), upload.single('certificate'), submitActivity);
router.get('/my', authorize('Student'), getMyActivities);
router.delete('/:id', authorize('Student'), deleteActivity);

// Teacher/Admin routes
router.get('/pending', authorize('Teacher', 'Admin'), getPendingActivities);
router.get('/history', authorize('Teacher', 'Admin'), getHistoryActivities);
router.put('/:id/status', authorize('Teacher', 'Admin'), updateActivityStatus);

module.exports = router;
