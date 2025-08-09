// routes/playerDdbRoutes.js
const express = require("express");
const {
  createPlayer, getPlayer, updatePlayer, deletePlayer, listPlayers
} = require("../controllers/playerDdbController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public reads
router.get("/", listPlayers);
router.get("/:phone", getPlayer);

// Admin mutations
router.post("/", authMiddleware, createPlayer);
router.patch("/:phone", authMiddleware, updatePlayer);
router.delete("/:phone", authMiddleware, deletePlayer);

module.exports = router;
