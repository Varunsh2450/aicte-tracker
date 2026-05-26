const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  where: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pointsRequested: {
    type: Number,
    required: true
  },
  certificate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  teacherFeedback: {
    type: String
  }
}, { timestamps: true });

// ==========================================
// 🚀 MONGOOSE DATABASE TRIGGERS (HOOKS) 🚀
// ==========================================

// 2. POST-SAVE TRIGGER: Audit Logger. Runs AFTER an activity is saved to the database.
activitySchema.post('save', function(doc) {
  // We can use triggers to log an audit trail in the background without cluttering the controller
  if (doc.status === 'Approved') {
    console.log(`[AUDIT TRIGGER]: Activity "${doc.title}" (ID: ${doc._id}) was APPROVED. Points awarded: ${doc.pointsRequested}`);
  } else if (doc.status === 'Rejected') {
    console.log(`[AUDIT TRIGGER]: Activity "${doc.title}" (ID: ${doc._id}) was REJECTED.`);
  } else if (doc.status === 'Pending') {
    console.log(`[AUDIT TRIGGER]: New Activity "${doc.title}" was submitted and is Pending review.`);
  }
});

module.exports = mongoose.model('Activity', activitySchema);
