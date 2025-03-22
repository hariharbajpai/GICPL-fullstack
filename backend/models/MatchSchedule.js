// models/MatchSchedule.js
const mongoose = require('mongoose');

const matchScheduleSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('MatchSchedule', matchScheduleSchema);