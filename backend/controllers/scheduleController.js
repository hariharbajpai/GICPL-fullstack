const mongoose = require('mongoose');
const MatchSchedule = require('../models/MatchSchedule');
const PressConference = require('../models/PressConference');
const Auction = require('../models/Auction');

// Add Match Schedule
const addMatchSchedule = async (req, res) => {
  try {
    const { team1, team2, date } = req.body;
    
    if (!team1 || !team2 || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Team 1, Team 2, and Date are required' 
      });
    }

    const newMatch = await MatchSchedule.create({ team1, team2, date });
    
    res.status(201).json({ 
      success: true, 
      message: 'Match scheduled successfully',
      data: newMatch
    });

  } catch (err) {
    console.error('Match Schedule Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to schedule match. Please try again later.'
    });
  }
};

// Add Press Conference
const addPressConference = async (req, res) => {
  try {
    const { meetLink } = req.body;

    if (!meetLink) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google Meet link is required' 
      });
    }

    const newPress = await PressConference.create({ meetLink });
    
    res.status(201).json({ 
      success: true, 
      message: 'Press conference link added successfully',
      data: newPress
    });

  } catch (err) {
    console.error('Press Conference Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add press conference. Please try again later.'
    });
  }
};

// Add Auction
const addAuction = async (req, res) => {
  try {
    const { meetLink } = req.body;

    if (!meetLink) {
      return res.status(400).json({ 
        success: false, 
        message: 'Google Meet link is required' 
      });
    }

    const newAuction = await Auction.create({ meetLink });
    
    res.status(201).json({ 
      success: true, 
      message: 'Auction link added successfully',
      data: newAuction
    });

  } catch (err) {
    console.error('Auction Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add auction. Please try again later.'
    });
  }
};

// Get All Schedules
const getAllSchedules = async (req, res) => {
  try {
    const matches = await MatchSchedule.find();
    const pressConferences = await PressConference.find();
    const auctions = await Auction.find();

    res.status(200).json({ 
      success: true, 
      data: { matches, pressConferences, auctions }
    });

  } catch (err) {
    console.error('Get Schedules Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch schedules. Please try again later.'
    });
  }
};

// Delete Match Schedule
const deleteMatchSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format' 
      });
    }

    const deletedMatch = await MatchSchedule.findByIdAndDelete(id);

    if (!deletedMatch) {
      return res.status(404).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Match deleted successfully',
      data: deletedMatch
    });

  } catch (err) {
    console.error('Delete Match Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete match. Please try again later.'
    });
  }
};

module.exports = {
  addMatchSchedule,
  addPressConference,
  addAuction,
  getAllSchedules,
  deleteMatchSchedule
};