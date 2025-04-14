const express = require("express");
const router = express.Router();
const City = require("../models/City");
const path = require("path");
const fs = require("fs");

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

// Add new hotel to a city
// In the POST /:cityName/hotels route, remove the image requirement check
router.post("/:cityName/hotels", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming data
    console.log("Request files:", req.files); // Log files if any

    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      console.log("City not found:", req.params.cityName);
      return res.status(404).json({ message: "City not found" });
    }

    // Process amenities
    const amenities = [];
    for (let key in req.body) {
      if (key.startsWith('amenities[')) {
        amenities.push(req.body[key]);
      }
    }

    // Generate random coordinates within Nepal
    const randomLat = 26.347 + (Math.random() * 4.653);
    const randomLng = 80.058 + (Math.random() * 8.942);

    const newHotel = {
      id: `hotel${Date.now()}`,
      name: req.body.name,
      location: req.body.location,
      price: parseFloat(req.body.price),
      rating: parseFloat(req.body.rating),
      amenities: amenities,
      distance: parseFloat(req.body.distance),
      description: req.body.description || '',
      coords: [randomLat, randomLng],
      reviews: { count: 0, average: 0 },
      image: req.files?.mainImage ? [`/uploads/${req.files.mainImage.name}`] : [],
      detailsImage: req.files?.detailImages ? 
        (Array.isArray(req.files.detailImages) ? 
          req.files.detailImages.map(file => `/uploads/${file.name}`) : 
          [`/uploads/${req.files.detailImages.name}`]) : 
        []
    };

    // Optional file handling
    if (req.files) {
      const uploadDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (req.files.mainImage) {
        await req.files.mainImage.mv(path.join(uploadDir, req.files.mainImage.name));
      }
      if (req.files.detailImages) {
        if (Array.isArray(req.files.detailImages)) {
          await Promise.all(req.files.detailImages.map(file => 
            file.mv(path.join(uploadDir, file.name))
          ));
        } else {
          await req.files.detailImages.mv(path.join(uploadDir, req.files.detailImages.name));
        }
      }
    }

    city.hotels.push(newHotel);
    await city.save();
    
    console.log("Hotel created successfully:", newHotel);
    res.status(201).json(newHotel);
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      body: req.body,
      files: req.files
    });
    res.status(500).json({ 
      message: "Failed to create hotel",
      error: error.message
    });
  }
});

// Update hotel
router.put("/:cityName/hotels/:hotelId", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotelIndex = city.hotels.findIndex(h => h.id === req.params.hotelId);
    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    city.hotels[hotelIndex] = {
      ...city.hotels[hotelIndex].toObject(),
      ...req.body,
      id: req.params.hotelId
    };

    await city.save();
    res.json(city.hotels[hotelIndex]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete hotel
router.delete("/:cityName/hotels/:hotelId", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotelIndex = city.hotels.findIndex(h => h.id === req.params.hotelId);
    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    city.hotels.splice(hotelIndex, 1);
    await city.save();

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;