// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', matchController.getMatches);

// Admin-only routes
router.post('/', authMiddleware, matchController.createMatch);
router.put('/:id', authMiddleware, matchController.updateMatch);
router.delete('/:id', authMiddleware, matchController.deleteMatch);

module.exports = router;