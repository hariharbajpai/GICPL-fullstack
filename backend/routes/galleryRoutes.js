const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware');

// Upload Image (Protected Route - Admins Only)
router.post('/', authMiddleware, upload.single('file'), galleryController.uploadImage);

// Get All Images (Public Route)
router.get('/', galleryController.getAllImages);

module.exports = router;