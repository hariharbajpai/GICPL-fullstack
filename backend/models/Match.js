// models/Match.js
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  matchDate: { type: Date, required: true },
  pressConferenceLink: { type: String, default: '' },
  auctionLink: { type: String, default: '' },
});

module.exports = mongoose.model('Match', MatchSchema);