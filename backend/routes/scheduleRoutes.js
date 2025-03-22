const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addMatchSchedule,
  addPressConference,
  addAuction,
  getAllSchedules,
  deleteMatchSchedule
} = require('../controllers/scheduleController');

// Admin-only routes
router.post('/match-schedule', authMiddleware, addMatchSchedule);
router.post('/press-conference', authMiddleware, addPressConference);
router.post('/auction', authMiddleware, addAuction);

// Delete route
router.delete('/match-schedule/:id', authMiddleware, deleteMatchSchedule);

// Public route
router.get('/schedules', getAllSchedules);

module.exports = router;