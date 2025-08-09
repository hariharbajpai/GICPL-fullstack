// controllers/teamController.js
const Team = require('../models/Teams.js'); // ✅ added .js

const getAllTeams = async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const teams = await Team.find(filter).sort({ section: 1, name: 1 });
    res.status(200).json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching teams' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error while fetching team' });
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, section, captain, players } = req.body;
    if (!name || !section || !captain) {
      return res.status(400).json({ success: false, message: 'Team name, section, and captain are required' });
    }
    const existingTeam = await Team.findOne({ name: name.trim() });
    if (existingTeam) return res.status(409).json({ success: false, message: 'Team with this name already exists' });
    if (!['GICPL-OG', 'GICPL-H'].includes(section)) {
      return res.status(400).json({ success: false, message: 'Invalid section. Must be GICPL-OG or GICPL-H' });
    }
    const team = new Team({ name: name.trim(), section, captain: captain.trim(), players: players || [] });
    const savedTeam = await team.save();
    res.status(201).json({ success: true, message: 'Team created successfully', data: savedTeam });
  } catch (error) {
    console.error('Error creating team:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Server error while creating team' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { name, section, captain, players } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    if (name && name.trim() !== team.name) {
      const dup = await Team.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (dup) return res.status(409).json({ success: false, message: 'Another team with this name already exists' });
    }

    if (name) team.name = name.trim();
    if (section) {
      if (!['GICPL-OG', 'GICPL-H'].includes(section)) {
        return res.status(400).json({ success: false, message: 'Invalid section. Must be GICPL-OG or GICPL-H' });
      }
      team.section = section;
    }
    if (captain) team.captain = captain.trim();
    if (players !== undefined) team.players = players;

    const updatedTeam = await team.save();
    res.status(200).json({ success: true, message: 'Team updated successfully', data: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    res.status(500).json({ success: false, message: 'Server error while updating team' });
  }
};

const addPlayer = async (req, res) => {
  try {
    const { name, role = 'Player' } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Player name is required' });

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const exists = team.players.some((p) => p.name.toLowerCase() === name.trim().toLowerCase());
    if (exists) return res.status(409).json({ success: false, message: 'Player already exists in this team' });

    if (!['C', 'VC', 'WK', 'Player'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be C, VC, WK, or Player' });
    }

    team.players.push({ name: name.trim(), role });
    const updatedTeam = await team.save();
    res.status(200).json({ success: true, message: 'Player added successfully', data: updatedTeam });
  } catch (error) {
    console.error('Error adding player:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error while adding player' });
  }
};

const removePlayer = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const idx = team.players.findIndex((p) => p._id.toString() === req.params.playerId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Player not found in team' });

    team.players.splice(idx, 1);
    const updatedTeam = await team.save();
    res.status(200).json({ success: true, message: 'Player removed successfully', data: updatedTeam });
  } catch (error) {
    console.error('Error removing player:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error while removing player' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid team ID format' });
    }
    res.status(500).json({ success: false, message: 'Server error while deleting team' });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  addPlayer,
  removePlayer,
  deleteTeam,
};
