const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  meetLink: { type: String, required: true }, // Updated to use Google Meet link
});

module.exports = mongoose.model('Auction', auctionSchema);