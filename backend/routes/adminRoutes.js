const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  updatePassword,
  verifyEmail,
  requestPasswordReset,
  logout, // Added logout function
} = require('../controllers/adminController');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
});

router.post('/signup', signup);
router.post('/login', limiter, login);
router.post('/update-password', updatePassword);
router.get('/verify-email', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/logout', logout); // Added logout route

module.exports = router;