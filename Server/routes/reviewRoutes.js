const express = require("express");
const router = express.Router();
const City = require("../models/City");

// Add a review to a hotel
router.post("/cities/:city/hotels/:hotelId/reviews", async (req, res) => {
  try {
    const { city, hotelId } = req.params;
    const { rating, comment, reviewer } = req.body;

    console.log(`Adding review for city: ${city}, hotel: ${hotelId}`);

    // Find the city, case insensitive
    const cityDoc = await City.findOne({
      name: { $regex: new RegExp("^" + city + "$", "i") },
    });

    if (!cityDoc) {
      return res.status(404).json({ message: "City not found" });
    }

    // Find the hotel
    const hotel = cityDoc.hotels.find(
      (h) => h.id === hotelId || h._id.toString() === hotelId
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Add the review
    hotel.reviews.push({
      reviewer: reviewer || "Anonymous User",
      rating: Number(rating),
      comment,
    });

    // Update hotel rating
    const totalRating = hotel.reviews.reduce((sum, r) => sum + r.rating, 0);
    hotel.rating = (totalRating / hotel.reviews.length).toFixed(1);

    // Save to database
    await cityDoc.save();

    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error adding review:", error);
    res
      .status(500)
      .json({ message: "Failed to add review", error: error.message });
  }
});

module.exports = router;