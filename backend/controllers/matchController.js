// controllers/matchController.js
const Match = require('../models/Match');

const matchController = {
  // Create a new match (Admin only)
  createMatch: async (req, res) => {
    try {
      const { team1, team2, matchDate, pressConferenceLink, auctionLink } = req.body;

      // Validate required fields
      if (!team1 || !team2 || !matchDate) {
        return res.status(400).json({ success: false, message: 'Team names and match date are required' });
      }

      const newMatch = new Match({ team1, team2, matchDate, pressConferenceLink, auctionLink });
      await newMatch.save();

      res.status(201).json({ success: true, message: 'Match created successfully', data: newMatch });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get all matches (Public access)
  getMatches: async (req, res) => {
    try {
      const matches = await Match.find();
      res.status(200).json({ success: true, message: 'Matches fetched successfully', data: matches });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Update a match (Admin only)
  updateMatch: async (req, res) => {
    try {
      const { id } = req.params;
      const { team1, team2, matchDate, pressConferenceLink, auctionLink } = req.body;

      const updatedMatch = await Match.findByIdAndUpdate(
        id,
        { team1, team2, matchDate, pressConferenceLink, auctionLink },
        { new: true }
      );

      if (!updatedMatch) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      res.status(200).json({ success: true, message: 'Match updated successfully', data: updatedMatch });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete a match (Admin only)
  deleteMatch: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMatch = await Match.findByIdAndDelete(id);

      if (!deletedMatch) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }

      res.status(200).json({ success: true, message: 'Match deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = matchController;