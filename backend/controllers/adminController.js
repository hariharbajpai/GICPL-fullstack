const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const validator = require('validator');
const nodemailer = require('nodemailer');
 

const allowedEmails = new Set([
  'nikyad22@gmail.com',
  'anshagrawal343@gmail.com',
  'shukla6abhay@gmail.com',
  'agrawal.aryan1000@gmail.com',
  'saharsss64@gmail.com',
  'harihar701764@gmail.com',
]);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    text: `Click the link to verify your email: http://yourdomain.com/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!validator.isMobilePhone(phoneNumber, 'any')) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format' });
    }

    if (!allowedEmails.has(email)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to sign up' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, include a number, and a special character',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, phoneNumber, password: hashedPassword });
    await newAdmin.save();

    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, verificationToken);

    console.log(`✅ New admin registered: ${email}`);
    res.status(201).json({ success: true, message: 'Admin registered successfully. Please verify your email.' });
  } catch (err) {
    console.error('❌ Signup Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Login Response:", { success: true, token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin', // Ensure role is included
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, phoneNumber, newPassword } = req.body;

    if (!email || !phoneNumber || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, phone number, and new password are required' });
    }

    const admin = await Admin.findOne({ email, phoneNumber });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid email or phone number' });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, include a number, and a special character',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log(`✅ Password updated for admin: ${email}`);
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Update Password Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ email: decoded.email });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    admin.isVerified = true;
    await admin.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Admin not found' });
    }

    const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await sendVerificationEmail(email, resetToken);

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Logout function
exports.logout = async (req, res) => {
  try {
    // Optionally, you can invalidate the token on the server side if needed
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};