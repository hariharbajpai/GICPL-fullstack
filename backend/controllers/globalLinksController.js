const GlobalLinks = require('../models/GlobalLinks');

// Ensure one single global document exists
async function getSingleton() {
  let data = await GlobalLinks.findOne();
  if (!data) data = await GlobalLinks.create({});
  return data;
}

exports.getGlobalLinks = async (req, res) => {
  const data = await getSingleton();
  res.status(200).json(data);
};

exports.updatePressLink = async (req, res) => {
  const { pressConferenceLink } = req.body;
  const data = await getSingleton();
  data.pressConferenceLink = pressConferenceLink;
  await data.save();
  res.status(200).json({ message: 'Press link updated' });
};

exports.updateAuctionLink = async (req, res) => {
  const { auctionLink } = req.body;
  const data = await getSingleton();
  data.auctionLink = auctionLink;
  await data.save();
  res.status(200).json({ message: 'Auction link updated' });
};

exports.deletePressLink = async (req, res) => {
  const data = await getSingleton();
  data.pressConferenceLink = '';
  await data.save();
  res.status(200).json({ message: 'Press link deleted' });
};

exports.deleteAuctionLink = async (req, res) => {
  const data = await getSingleton();
  data.auctionLink = '';
  await data.save();
  res.status(200).json({ message: 'Auction link deleted' });
};
