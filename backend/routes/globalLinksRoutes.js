const express = require('express');
const router = express.Router();
const {
  getGlobalLinks,
  updatePressLink,
  updateAuctionLink,
  deletePressLink,
  deleteAuctionLink
} = require('../controllers/globalLinksController');

// If using auth middleware, add it here
// const { protect } = require('../middlewares/authMiddleware');

router.get('/', getGlobalLinks);
router.patch('/press', updatePressLink);
router.patch('/auction', updateAuctionLink);
router.delete('/press', deletePressLink);
router.delete('/auction', deleteAuctionLink);

module.exports = router;
