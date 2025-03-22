const mongoose = require('mongoose');
const Admin = require('../models/Admin'); // Import the Admin model
require('dotenv').config(); // Load environment variables

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => console.log(err));

// Function to seed the admin
const seedAdmin = async () => {
  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@cricket.com' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(); // Exit the script
    }

    // Create a new admin
    const admin = new Admin({
      email: 'admin@cricket.com',
      password: 'admin123', // Password will be hashed by the pre-save hook in the Admin model
    });

    // Save the admin to the database
    await admin.save();
    console.log('Admin seeded successfully');
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  } finally {
    process.exit(); // Exit the script
  }
};

// Run the seed function
seedAdmin();