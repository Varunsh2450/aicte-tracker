const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection to:', process.env.MONGO_URI.replace(/:([^:@]{3,})@/, ':***@'));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('SUCCESS: Connected to MongoDB Atlas!');
  process.exit(0);
}).catch(err => {
  console.error('FAILED to connect to MongoDB Atlas:', err.message);
  process.exit(1);
});
