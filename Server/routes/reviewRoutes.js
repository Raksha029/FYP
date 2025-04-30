const express = require("express");
const router = express.Router();
const City = require("../models/City");
const { authenticateToken } = require("../middleware/authMiddleware");

// Add authenticateToken middleware to the route
router.post("/cities/:city/hotels/:hotelId/reviews", authenticateToken, async (req, res) => {
  try {
    const { city, hotelId } = req.params;
    const { rating, comment } = req.body;
    
    // Get user's name from the authenticated user object
    const reviewer = `${req.user.firstName} ${req.user.lastName}`;

    // Validate rating is a valid number between 1 and 5
    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    // Find the city, case insensitive
    const cityDoc = await City.findOne({
      name: { $regex: new RegExp("^" + city + "$", "i") },
    });

    if (!cityDoc) {
      return res.status(404).json({ message: "City not found" });
    }

    // Find the hotel using proper MongoDB operators
    const hotelIndex = cityDoc.hotels.findIndex(
      (h) => h.id === hotelId || h._id.toString() === hotelId
    );

    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Initialize reviews array if it doesn't exist
    if (!cityDoc.hotels[hotelIndex].reviews) {
      cityDoc.hotels[hotelIndex].reviews = [];
    }

    // Add the review with validated rating
    cityDoc.hotels[hotelIndex].reviews.push({
      reviewer: reviewer,
      rating: numericRating,
      comment,
    });

    await cityDoc.save();

    // Transform image paths before sending response
    const hotelData = cityDoc.hotels[hotelIndex].toObject();
    if (hotelData.image) {
      hotelData.image = hotelData.image.map(img => 
        img.startsWith('http') ? img : `http://localhost:4000${img.startsWith('/') ? img : `/${img}`}`
      );
    }
    if (hotelData.detailsImage) {
      hotelData.detailsImage = hotelData.detailsImage.map(img => 
        img.startsWith('http') ? img : `http://localhost:4000${img.startsWith('/') ? img : `/${img}`}`
      );
    }

    res.status(201).json(hotelData);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ 
      message: "Failed to add review", 
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;