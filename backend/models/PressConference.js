const mongoose = require('mongoose');

const pressConferenceSchema = new mongoose.Schema({
  meetLink: { type: String, required: true }, // Updated to use Google Meet link
});

module.exports = mongoose.model('PressConference', pressConferenceSchema);