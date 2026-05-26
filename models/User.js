const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  usn: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  semester: {
    type: Number
  },
  avatar: {
    type: String, // Path to uploaded avatar or default
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'Admin'],
    default: 'Student'
  },
  // Only for students, keep track of their points
  totalPoints: {
    type: Number,
    default: 0
  },
  notifications: [{
    message: String,
    type: { type: String, enum: ['success', 'error', 'info'], default: 'info' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  // Gamification: Badges awarded to students
  badges: [{
    name: String,
    icon: String, // e.g. 🥉, 🥈, 🏆
    awardedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// ==========================================
// 🚀 MONGOOSE DATABASE TRIGGERS (HOOKS) 🚀
// ==========================================

// 1. PRE-SAVE TRIGGER: Handle Badges & Password Hashing
userSchema.pre('save', async function() {
  
  // -- GAMIFICATION BADGES TRIGGER --
  // If the totalPoints field was modified, check if we should award new badges
  if (this.isModified('totalPoints') && this.role === 'Student') {
    const existingBadges = this.badges.map(b => b.name);
    
    if (this.totalPoints >= 50 && !existingBadges.includes('Bronze Achiever')) {
      this.badges.push({ name: 'Bronze Achiever', icon: '🥉' });
    }
    if (this.totalPoints >= 100 && !existingBadges.includes('Silver Scholar')) {
      this.badges.push({ name: 'Silver Scholar', icon: '🥈' });
    }
    if (this.totalPoints >= 200 && !existingBadges.includes('Gold Champion')) {
      this.badges.push({ name: 'Gold Champion', icon: '🏆' });
    }
    if (this.totalPoints >= 500 && !existingBadges.includes('Diamond Legend')) {
      this.badges.push({ name: 'Diamond Legend', icon: '💎' });
    }
  }

  // -- PASSWORD HASHING TRIGGER --
  // Only trigger the hashing if the password field is new or modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
