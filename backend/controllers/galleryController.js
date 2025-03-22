const Gallery = require('../models/Gallery');

// Upload Image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const newImage = new Gallery({
      filename: req.file.filename,
      path: req.file.path,
    });

    await newImage.save();

    res.status(201).json({ success: true, message: 'Image uploaded successfully', data: newImage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Images
exports.getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find();
    res.status(200).json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};