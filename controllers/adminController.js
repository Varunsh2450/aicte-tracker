const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalTeachers = await User.countDocuments({ role: 'Teacher' });
    const totalActivities = await Activity.countDocuments();
    
    const approvedActivities = await Activity.countDocuments({ status: 'Approved' });
    const pendingActivities = await Activity.countDocuments({ status: 'Pending' });

    // Aggregate to find total points awarded across the college
    const pointsData = await User.aggregate([
      { $match: { role: 'Student' } },
      { $group: { _id: null, total: { $sum: '$totalPoints' } } }
    ]);
    const totalPointsAwarded = pointsData.length > 0 ? pointsData[0].total : 0;

    res.json({
      totalStudents,
      totalTeachers,
      totalActivities,
      approvedActivities,
      pendingActivities,
      totalPointsAwarded
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 }).select('-password -notifications');
    res.json(users);
  } catch (error) {
    console.error('Fetch all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers
};
