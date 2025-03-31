const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Corrected route definitions with proper callback functions
router.post("/add", authenticateToken, (req, res) => {
  favoriteController.addFavorite(req, res);
});

router.delete("/remove/:propertyId", authenticateToken, (req, res) => {
  favoriteController.removeFavorite(req, res);
});

router.get("/", authenticateToken, (req, res) => {
  favoriteController.getFavorites(req, res);
});

module.exports = router;