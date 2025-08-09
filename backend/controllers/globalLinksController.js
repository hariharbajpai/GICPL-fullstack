// controllers/globalLinksController.js
const GlobalLinks = require('../models/GlobalLinks');

// Ensure only one global document exists
async function getSingleton() {
  let data = await GlobalLinks.findOne();
  if (!data) {
    data = await GlobalLinks.create({
      pressConferenceLink: '',
      auctionLink: '',
    });
  }
  return data;
}

// GET /api/global-links
exports.getGlobalLinks = async (req, res) => {
  try {
    const data = await getSingleton();
    res.status(200).json({
      success: true,
      data: {
        pressConferenceLink: data.pressConferenceLink || '',
        auctionLink: data.auctionLink || '',
      },
    });
  } catch (err) {
    console.error('Error fetching global links:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/global-links/press
exports.updatePressLink = async (req, res) => {
  try {
    const { pressConferenceLink } = req.body;
    const data = await getSingleton();
    data.pressConferenceLink = pressConferenceLink || '';
    await data.save();
    res.status(200).json({ success: true, message: 'Press link updated' });
  } catch (err) {
    console.error('Error updating press link:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/global-links/auction
exports.updateAuctionLink = async (req, res) => {
  try {
    const { auctionLink } = req.body;
    const data = await getSingleton();
    data.auctionLink = auctionLink || '';
    await data.save();
    res.status(200).json({ success: true, message: 'Auction link updated' });
  } catch (err) {
    console.error('Error updating auction link:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/global-links/press
exports.deletePressLink = async (req, res) => {
  try {
    const data = await getSingleton();
    data.pressConferenceLink = '';
    await data.save();
    res.status(200).json({ success: true, message: 'Press link deleted' });
  } catch (err) {
    console.error('Error deleting press link:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/global-links/auction
exports.deleteAuctionLink = async (req, res) => {
  try {
    const data = await getSingleton();
    data.auctionLink = '';
    await data.save();
    res.status(200).json({ success: true, message: 'Auction link deleted' });
  } catch (err) {
    console.error('Error deleting auction link:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
