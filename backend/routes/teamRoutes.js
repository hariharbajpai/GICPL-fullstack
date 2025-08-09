// routes/teamRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware.js'); // ✅ added .js
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  addPlayer,
  removePlayer,
  deleteTeam,
} = require('../controllers/teamController.js'); // ✅ added .js

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', authMiddleware, createTeam);
router.put('/:id', authMiddleware, updateTeam);
router.post('/:id/players', authMiddleware, addPlayer);
router.delete('/:id/players/:playerId', authMiddleware, removePlayer);
router.delete('/:id', authMiddleware, deleteTeam);

module.exports = router;
