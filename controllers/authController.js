const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, usn, email, password, role, department, semester } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the user (Password hashing is now triggered automatically by the Mongoose hook in the User model!)
    const user = await User.create({
      name,
      usn: role === 'Student' ? usn : undefined,
      department: role === 'Student' ? department : undefined,
      semester: role === 'Student' ? semester : undefined,
      email,
      password, // Send raw password; the 'pre-save' trigger will hash it
      role: role || 'Student' // Default to Student if no role provided
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        usn: user.usn,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });

    // Check if user exists and password matches using our model method
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        usn: user.usn,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/auth/notifications/read
// @access  Private
const markNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.notifications.forEach(notif => notif.read = true);
      user.markModified('notifications');
      await user.save();
      res.json({ message: 'Notifications marked as read' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error marking notifications read' });
  }
};

// @desc    Get top 10 students for the leaderboard
// @route   GET /api/auth/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const topStudents = await User.find({ role: 'Student' })
      .select('-password -notifications') // Exclude sensitive info
      .sort({ totalPoints: -1 }) // Sort by points descending
      .limit(10);
      
    res.json(topStudents);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

// @desc    Get all students for reporting
// @route   GET /api/auth/students
// @access  Private (Teacher/Admin)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' })
      .select('-password -notifications') // Exclude sensitive info
      .sort({ department: 1, semester: 1, name: 1 });
      
    res.json(students);
  } catch (error) {
    console.error('Fetch all students error:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.department) user.department = req.body.department;
    if (req.body.semester) user.semester = req.body.semester;
    if (req.body.password) {
      user.password = req.body.password; // Mongoose hook hashes it
    }

    const updatedUser = await user.save();
    
    // Return updated user (excluding password)
    const token = require('jsonwebtoken').sign({ id: updatedUser._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      usn: updatedUser.usn,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      semester: updatedUser.semester,
      token,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = { register, login, getMe, markNotificationsRead, getLeaderboard, getAllStudents, updateProfile };
