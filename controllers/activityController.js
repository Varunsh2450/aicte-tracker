const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Submit a new activity (Student only)
// @route   POST /api/activities
// @access  Private (Student)
const submitActivity = async (req, res) => {
  try {
    const { title, where, description, pointsRequested } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a certificate' });
    }

    // Create new activity linked to the logged-in student
    const activity = await Activity.create({
      studentId: req.user._id,
      title,
      where,
      description,
      pointsRequested,
      certificate: req.file.path.replace(/\\/g, '/'), // handle windows paths
      status: 'Pending'
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Submit activity error:', error);
    res.status(500).json({ message: 'Server error submitting activity' });
  }
};

// @desc    Get all activities for the logged-in student
// @route   GET /api/activities/my
// @access  Private (Student)
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Fetch activities error:', error);
    res.status(500).json({ message: 'Server error fetching activities' });
  }
};

// @desc    Get all pending activities (Teacher/Admin)
// @route   GET /api/activities/pending
// @access  Private (Teacher, Admin)
const getPendingActivities = async (req, res) => {
  try {
    // Populate the student details to see who submitted it
    const activities = await Activity.find({ status: 'Pending' })
      .populate('studentId', 'name email usn')
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Fetch pending activities error:', error);
    res.status(500).json({ message: 'Server error fetching pending activities' });
  }
};

// @desc    Get history of reviewed activities (Teacher/Admin)
// @route   GET /api/activities/history
// @access  Private (Teacher, Admin)
const getHistoryActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ status: { $in: ['Approved', 'Rejected'] } })
      .populate('studentId', 'name email usn')
      .sort({ updatedAt: -1 });
    res.json(activities);
  } catch (error) {
    console.error('Fetch history activities error:', error);
    res.status(500).json({ message: 'Server error fetching history activities' });
  }
};

// @desc    Approve or Reject an activity
// @route   PUT /api/activities/:id/status
// @access  Private (Teacher, Admin)
const updateActivityStatus = async (req, res) => {
  try {
    const { status, teacherFeedback } = req.body; // status should be 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be Approved or Rejected' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Only update if it's currently pending
    if (activity.status !== 'Pending') {
      return res.status(400).json({ message: `Activity is already ${activity.status}` });
    }

    // Update activity
    activity.status = status;
    activity.approvedBy = req.user._id;
    if (teacherFeedback) {
      activity.teacherFeedback = teacherFeedback;
    }
    await activity.save();

    const student = await User.findById(activity.studentId);

    // If approved, add points to the student's total
    if (status === 'Approved' && student) {
      student.totalPoints += activity.pointsRequested;
    }
    
    // Add Notification
    if (student) {
      student.notifications.push({
        message: `Your activity "${activity.title}" was ${status.toLowerCase()}. ${status === 'Approved' ? `+${activity.pointsRequested} points awarded.` : ''}`,
        type: status === 'Approved' ? 'success' : 'error'
      });
      await student.save();
    }

    // Send email notification to the student
    if (student) {
      const sendEmail = require('../utils/sendEmail');
      const emailStatusColor = status === 'Approved' ? '#10B981' : '#EF4444';
      const emailMessage = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: ${emailStatusColor};">Activity ${status}!</h2>
          <p>Hello <strong>${student.name}</strong>,</p>
          <p>Your AICTE points request for the activity <strong>"${activity.title}"</strong> has been <strong>${status.toLowerCase()}</strong> by your teacher.</p>
          ${status === 'Approved' ? `<p><strong>+${activity.pointsRequested} Points</strong> have been added to your total.</p>` : ''}
          ${teacherFeedback ? `<p><strong>Teacher Feedback:</strong> <em>"${teacherFeedback}"</em></p>` : ''}
          <br/>
          <p>Log in to your dashboard to see your updated points.</p>
        </div>
      `;
      
      // We don't await this so it sends in the background and doesn't slow down the API response
      sendEmail({
        email: student.email,
        subject: `Update on your AICTE Points Request: ${activity.title}`,
        message: emailMessage
      });
    }

    res.json({ message: `Activity ${status.toLowerCase()} successfully`, activity });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error updating activity' });
  }
};

// @desc    Delete a pending activity request
// @route   DELETE /api/activities/:id
// @access  Private (Student)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Ensure it belongs to the student
    if (activity.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this activity' });
    }

    // Only allow deletion if it is pending
    if (activity.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete an activity that has already been reviewed' });
    }

    await activity.deleteOne();
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
};

module.exports = {
  submitActivity,
  getMyActivities,
  getPendingActivities,
  getHistoryActivities,
  updateActivityStatus,
  deleteActivity
};
