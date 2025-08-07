const mongoose = require('mongoose');

const globalLinksSchema = new mongoose.Schema({
  pressConferenceLink: { type: String, default: '' },
  auctionLink: { type: String, default: '' },
});

module.exports = mongoose.model('GlobalLinks', globalLinksSchema);
