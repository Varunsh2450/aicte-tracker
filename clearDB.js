const mongoose = require('mongoose');
const User = require('./models/User');
const Activity = require('./models/Activity');
require('dotenv').config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    await User.deleteMany({});
    await Activity.deleteMany({});

    console.log('✅ Database completely wiped! Ready for real data.');
    process.exit();
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
