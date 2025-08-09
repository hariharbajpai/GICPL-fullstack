const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/globalLinksController');

// Public GET
router.get('/', ctrl.getGlobalLinks);

// Admin updates (you can add auth middleware here)
router.patch('/press', ctrl.updatePressLink);
router.patch('/auction', ctrl.updateAuctionLink);
router.delete('/press', ctrl.deletePressLink);
router.delete('/auction', ctrl.deleteAuctionLink);

module.exports = router;
