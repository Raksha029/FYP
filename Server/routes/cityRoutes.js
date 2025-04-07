const express = require("express");
const router = express.Router();
const City = require("../models/City");

// Get all cities
router.get("/all", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific city
router.get("/:cityName", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp(req.params.cityName, "i"),
    });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top rated properties
router.get("/hotels/top-rated", async (req, res) => {
  try {
    const cities = await City.find();
    const topHotels = cities
      .flatMap((city) =>
        city.hotels.map((hotel) => ({
          ...hotel.toObject(),
          cityName: city.name,
        }))
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
    res.json(topHotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular places
router.get("/popular/places", async (req, res) => {
  try {
    const cities = await City.find();
    const popularPlaces = cities.map((city) => ({
      name: city.name,
      route: `/${city.name.toLowerCase()}`,
      image: city.hotels[0]?.image[0] || null,
    }));
    res.json(popularPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get hotel details
router.get("/:cityName/hotels/:hotelId", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotel = city.hotels.find((h) => h.id === req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Transform the hotel object to include full image paths
    const transformedHotel = {
      ...hotel.toObject(),
      detailsImage:
        hotel.detailsImage?.map((img) =>
          img.startsWith("/") ? img : `/images/${img}`
        ) || [],
      image:
        hotel.image?.map((img) =>
          img.startsWith("/") ? img : `/images/${img}`
        ) || [],
    };

    // Log the transformed hotel data
    console.log("Sending hotel data:", {
      id: transformedHotel.id,
      name: transformedHotel.name,
      imagePaths: {
        detailsImage: transformedHotel.detailsImage,
        image: transformedHotel.image,
      },
    });

    res.json(transformedHotel);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const count = await City.countDocuments();
    const sample = await City.findOne();
    res.json({
      totalCities: count,
      sampleCity: sample ? sample.name : null,
      sampleHotels: sample ? sample.hotels.length : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const count = await City.countDocuments();
    const sample = await City.findOne();
    res.json({
      count,
      sampleCity: sample
        ? {
            name: sample.name,
            hotelCount: sample.hotels.length,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route if it doesn't exist
router.get("/:cityName/hotels", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Transform image paths for all hotels
    const hotelsWithFullPaths = city.hotels.map((hotel) => ({
      ...hotel.toObject(),
      image:
        hotel.image?.map((img) =>
          img.startsWith("/") ? img : `/images/${img}`
        ) || [],
    }));

    res.json(hotelsWithFullPaths);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;