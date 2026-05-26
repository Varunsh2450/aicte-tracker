const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Activity = require('./models/Activity');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB... Inserting data...');

    // Hash a generic password for all dummy users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Dummy Teacher
    const teacher = await User.create({
      name: 'Dr. Smith (Teacher)',
      email: 'teacher@college.edu',
      password: hashedPassword,
      role: 'Teacher'
    });
    console.log('✅ Teacher created!');

    // 2. Create Dummy Students
    const studentsData = [
      { name: 'Rahul Sharma', email: 'rahul@student.edu', password: hashedPassword, role: 'Student' },
      { name: 'Priya Patel', email: 'priya@student.edu', password: hashedPassword, role: 'Student' },
      { name: 'Amit Singh', email: 'amit@student.edu', password: hashedPassword, role: 'Student' }
    ];
    
    const students = await User.insertMany(studentsData);
    console.log(`✅ ${students.length} Students created!`);

    // 3. Create Dummy Activities (Pending AICTE Points)
    const activitiesData = [
      {
        studentId: students[0]._id,
        title: 'NSS Blood Donation Camp',
        description: 'Donated blood at the college camp. Certificate attached.',
        pointsRequested: 50,
        status: 'Pending'
      },
      {
        studentId: students[0]._id,
        title: 'Smart India Hackathon',
        description: 'Reached the finals of SIH 2024.',
        pointsRequested: 100,
        status: 'Pending'
      },
      {
        studentId: students[1]._id,
        title: 'NPTEL Course Completion',
        description: 'Completed 8-week course on Cloud Computing.',
        pointsRequested: 75,
        status: 'Pending'
      },
      {
        studentId: students[2]._id,
        title: 'Tree Plantation Drive',
        description: 'Planted 10 saplings during the weekend drive.',
        pointsRequested: 20,
        status: 'Pending'
      }
    ];

    const activities = await Activity.insertMany(activitiesData);
    console.log(`✅ ${activities.length} Activities created!`);

    console.log('\n🎉 Database successfully populated with dummy data!');
    console.log('You can now log in with any of the student or teacher emails using the password: password123');
    
    // Disconnect
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
