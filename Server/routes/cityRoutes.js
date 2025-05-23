const express = require("express");
const router = express.Router();
const City = require("../models/City");
const path = require("path");
const fs = require("fs");
const Booking = require("../models/Booking");
const mongoose = require('mongoose');

// Get all cities
router.get("/all", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update the specific city route
router.get("/:cityName", async (req, res) => {
  try {
    // First update room availability and booking statuses
    const bookings = await Booking.find({
      status: { $in: ["Confirmed", "Pending"] }
    });

    const currentDate = new Date();

    for (const booking of bookings) {
      // Check if booking is completed (past checkout date)
      if (new Date(booking.checkOutDate) < currentDate && booking.status === "Confirmed") {
        // Update booking status to completed
        booking.status = "Completed";
        await booking.save();

        // Restore room availability for completed bookings
        const cityWithHotel = await City.findOne({ "hotels.id": booking.hotelId });
        if (cityWithHotel) {
          const hotelIndex = cityWithHotel.hotels.findIndex(h => h.id === booking.hotelId);
          if (hotelIndex !== -1) {
            const roomIndex = cityWithHotel.hotels[hotelIndex].rooms.findIndex(
              r => r.type === booking.roomType
            );

            if (roomIndex !== -1) {
              cityWithHotel.hotels[hotelIndex].rooms[roomIndex].available += booking.roomCount;
              await cityWithHotel.save();
            }
          }
        }
      }
    }

    // Get active bookings (not completed or cancelled)
    const activeBookings = await Booking.find({
      status: { $in: ["Confirmed", "Pending"] },
      checkOutDate: { $gt: currentDate }
    });

    // Get the city data and update room availability
    const city = await City.findOne({
      name: new RegExp(req.params.cityName, "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Reset and calculate current availability
    // Update the room availability calculation
    city.hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        // Start with current availability from database
        let currentAvailable = room.available;
        
        // Reduce availability based on active bookings
        const roomBookings = activeBookings.filter(booking => 
          booking.hotelId === hotel.id && booking.roomType === room.type
        );
        
        if (roomBookings.length > 0) {
          const bookedCount = roomBookings.reduce((total, booking) => total + booking.roomCount, 0);
          room.available = Math.max(currentAvailable - bookedCount, 0);
        }
      });
    });

    await city.save();
    res.json(city);
  } catch (error) {
    console.error('Error in city route:', error);
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
      detailsImage: hotel.detailsImage?.map(img => 
        img.startsWith('http') ? img : `http://localhost:4000${img}`
      ) || [],
      image: hotel.image?.map(img => 
        img.startsWith('http') ? img : `http://localhost:4000${img}`
      ) || []
    };

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
// Get hotels for a specific city
router.get("/:cityName/hotels", async (req, res) => {
  try {
    const city = await City.findOne({
      name: new RegExp("^" + req.params.cityName + "$", "i"),
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Transform the hotels to include full image paths
    const transformedHotels = city.hotels.map(hotel => ({
      ...hotel.toObject(),
      cityName: city.name,
      image: hotel.image?.map(img =>
        img.startsWith('http') ? img : `http://localhost:4000${img}`
      ) || [],
      detailsImage: hotel.detailsImage?.map(img =>
        img.startsWith('http') ? img : `http://localhost:4000${img}`
      ) || []
    }));

    res.json(transformedHotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add new hotel to a city
// Define city coordinates with all major Nepalese cities
const cityCoordinates = {
  'Kathmandu': { lat: 27.7172, lng: 85.3240, radius: 0.03 },
  'Pokhara': { lat: 28.2096, lng: 83.9856, radius: 0.04 },
  'Bhaktapur': { lat: 27.6710, lng: 85.4298, radius: 0.02 },
  'Lalitpur': { lat: 27.6588, lng: 85.3247, radius: 0.02 },
  'Lumbini': { lat: 27.6792, lng: 83.5070, radius: 0.03 },
  'Janakpur': { lat: 26.7271, lng: 85.9407, radius: 0.03 },
  'Nagarkot': { lat: 27.7127, lng: 85.5233, radius: 0.02 },
  'Dharan': { lat: 26.8065, lng: 87.2846, radius: 0.03 }
};

// Improved random coordinate generation
const generateRandomCoords = (cityName) => {
  const cityCoords = cityCoordinates[cityName];
  if (!cityCoords) {
    throw new Error(`Coordinates not defined for city: ${cityName}`);
  }

  // Generate random angle and distance for more natural distribution
  const angle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * cityCoords.radius;
  
  return {
    lat: cityCoords.lat + (randomDistance * Math.cos(angle)),
    lng: cityCoords.lng + (randomDistance * Math.sin(angle))
  };
};

// Update the POST route for adding hotels
router.post("/:cityName/hotels", async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // Handle file uploads
    let mainImagePath = null;
    let detailImagePaths = [];

    if (req.files) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (req.files.mainImage) {
        const mainImage = req.files.mainImage;
        const mainImageName = `${Date.now()}-${mainImage.name}`;
        await mainImage.mv(path.join(uploadDir, mainImageName));
        mainImagePath = `/uploads/${mainImageName}`; // Remove extra slash
      }

      if (req.files.detailImages) {
        const detailImages = Array.isArray(req.files.detailImages) 
          ? req.files.detailImages 
          : [req.files.detailImages];

        for (const image of detailImages) {
          const imageName = `${Date.now()}-${image.name}`;
          await image.mv(path.join(uploadDir, imageName));
          detailImagePaths.push(`/uploads/${imageName}`); // Remove extra slash
        }
      }
    }

    // Generate coordinates for the specific city
    const coords = generateRandomCoords(cityName);

    const newHotel = {
      id: `hotel${Date.now()}`,
      name: req.body.name,
      location: req.body.location,
      price: parseFloat(req.body.price),
      rating: parseFloat(req.body.rating),
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities],
      distance: parseFloat(req.body.distance),
      description: req.body.description || '',
      coords: [coords.lat, coords.lng],
      rating: 0, // Default rating
  policies: {
    checkIn: req.body.policies?.checkIn || "From 3:00 PM",
    checkOut: req.body.policies?.checkOut || "Until 11:00 AM",
    cancellation: req.body.policies?.cancellation || "Free cancellation up to 48 hours before check-in",
    payment: req.body.policies?.payment || "Khalti digital payment only"
  },
  reviews: {
    count: 0,
    average: 0,
    ratings: []
  },
      image: mainImagePath ? [mainImagePath] : [],
      detailsImage: detailImagePaths,
      rooms: []
    };

    const city = await City.findOne({ 
      name: new RegExp("^" + cityName + "$", "i") 
    });
    
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.hotels.push(newHotel);
    await city.save();

    // Transform image paths for response
    const transformedHotel = {
      ...newHotel,
      cityName: city.name,
      image: newHotel.image.map(img => `http://localhost:4000${img}`),
      detailsImage: newHotel.detailsImage.map(img => `http://localhost:4000${img}`)
    };

    res.status(201).json(transformedHotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: error.message });
  }
});


// Update hotel route
router.put("/:cityName/hotels/:hotelId", async (req, res) => {
  try {
    const { cityName, hotelId } = req.params;
    const updateData = req.body;

    const city = await City.findOne({
      name: new RegExp("^" + cityName + "$", "i")
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotelIndex = city.hotels.findIndex(h => h.id === hotelId);
    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Handle file uploads if present
    let mainImagePath = null;
    let detailImagePaths = [];

    if (req.files) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (req.files.mainImage) {
        const mainImage = req.files.mainImage;
        const mainImageName = `${Date.now()}-${mainImage.name}`;
        await mainImage.mv(path.join(uploadDir, mainImageName));
        mainImagePath = `/uploads/${mainImageName}`; // Remove extra slash
      }

      if (req.files.detailImages) {
        const detailImages = Array.isArray(req.files.detailImages) 
          ? req.files.detailImages 
          : [req.files.detailImages];

        for (const image of detailImages) {
          const imageName = `${Date.now()}-${image.name}`;
          await image.mv(path.join(uploadDir, imageName));
          detailImagePaths.push(`/uploads/${imageName}`); // Remove extra slash
        }
      }
    }

    // Update hotel data
    const updatedHotel = {
      ...city.hotels[hotelIndex].toObject(),
      name: updateData.name,
      location: updateData.location,
      price: parseFloat(updateData.price),
      rating: parseFloat(updateData.rating),
      distance: parseFloat(updateData.distance),
      description: updateData.description,
      amenities: Array.isArray(updateData.amenities) ? updateData.amenities : [updateData.amenities],
    };

    // Update images only if new ones were uploaded
    if (mainImagePath) {
      updatedHotel.image = [mainImagePath];
    }
    if (detailImagePaths.length > 0) {
      updatedHotel.detailsImage = detailImagePaths;
    }

    city.hotels[hotelIndex] = updatedHotel;
    await city.save();

    // Transform image paths for response
    const transformedHotel = {
      ...updatedHotel,
      image: updatedHotel.image.map(img => `http://localhost:4000${img}`),
      detailsImage: updatedHotel.detailsImage.map(img => `http://localhost:4000${img}`)
    };

    res.json(transformedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update the POST route for adding new hotels
router.post("/:cityName/hotels", async (req, res) => {
  try {
    const { cityName } = req.params;
    
    // Handle file uploads
    let mainImagePath = null;
    let detailImagePaths = [];

    if (req.files) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      if (req.files.mainImage) {
        const mainImage = req.files.mainImage;
        const mainImageName = `${Date.now()}-${mainImage.name}`;
        await mainImage.mv(path.join(uploadDir, mainImageName));
        mainImagePath = `/uploads/${mainImageName}`; // Remove extra slash
      }

      if (req.files.detailImages) {
        const detailImages = Array.isArray(req.files.detailImages) 
          ? req.files.detailImages 
          : [req.files.detailImages];

        for (const image of detailImages) {
          const imageName = `${Date.now()}-${image.name}`;
          await image.mv(path.join(uploadDir, imageName));
          detailImagePaths.push(`/uploads/${imageName}`); // Remove extra slash
        }
      }
    }

    // Define city coordinates
    const cityCoordinates = {
      'Kathmandu': { lat: 27.7172, lng: 85.3240, radius: 0.05 }
    };

    const cityCoords = cityCoordinates[cityName] || { lat: 27.7172, lng: 85.3240, radius: 0.05 };
    const randomCoord = (base, radius) => base + (Math.random() * radius * 2 - radius);

    const newHotel = {
      id: `hotel${Date.now()}`,
      name: req.body.name,
      location: req.body.location,
      price: parseFloat(req.body.price),
      rating: parseFloat(req.body.rating),
      amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities],
      distance: parseFloat(req.body.distance),
      description: req.body.description || '',
      coords: [
        randomCoord(cityCoords.lat, cityCoords.radius),
        randomCoord(cityCoords.lng, cityCoords.radius)
      ],
      reviews: { count: 0, average: 0 },
      image: mainImagePath ? [mainImagePath] : [],
      detailsImage: detailImagePaths,
      rooms: []
    };

    const city = await City.findOne({ name: cityName });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.hotels.push(newHotel);
    await city.save();

    // Transform image paths for response
    const transformedHotel = {
      ...newHotel,
      image: newHotel.image.map(img => `http://localhost:4000${img}`),
      detailsImage: newHotel.detailsImage.map(img => `http://localhost:4000${img}`)
    };

    res.status(201).json(transformedHotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add these new routes for room management
router.post("/rooms/add", async (req, res) => {
  try {
    const { cityName, hotelId, roomData } = req.body;
    
    const city = await City.findOne({ name: cityName });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Find hotel by MongoDB _id instead of custom ID
    const hotel = city.hotels.find(h => h._id.toString() === hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Create new room with MongoDB ID
    const newRoom = {
      _id: new mongoose.Types.ObjectId(),
      type: roomData.type,
      price: roomData.price,
      capacity: roomData.capacity,
      description: roomData.description,
      available: roomData.available || 0
    };

    hotel.rooms.push(newRoom);
    await city.save();
    
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/rooms/update", async (req, res) => {
  try {
    const { cityName, hotelId, roomId, updatedRoom } = req.body;
    
    const city = await City.findOne({ name: cityName });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    // Find hotel by MongoDB _id
    const hotel = city.hotels.find(h => h._id.toString() === hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Find room by MongoDB _id
    const roomIndex = hotel.rooms.findIndex(r => r._id.toString() === roomId);
    if (roomIndex === -1) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Preserve original _id
    hotel.rooms[roomIndex] = { 
      ...hotel.rooms[roomIndex].toObject(),
      ...updatedRoom,
      _id: hotel.rooms[roomIndex]._id
    };
    
    await city.save();
    res.json(hotel.rooms[roomIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/rooms", async (req, res) => {
  try {
    const { cityName, hotelId, roomIds } = req.body;
    
    const city = await City.findOne({ name: cityName });
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotel = city.hotels.find(h => h._id.toString() === hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Remove the rooms with matching IDs
    hotel.rooms = hotel.rooms.filter(room => 
      !roomIds.includes(room._id.toString())
    );
    
    await city.save();
    res.json({ message: "Rooms deleted successfully" });
  } catch (error) {
    console.error("Delete rooms error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete hotel
router.delete("/:cityName/hotels/:hotelId", async (req, res) => {
  try {
    const { cityName, hotelId } = req.params;

    const city = await City.findOne({
      name: new RegExp("^" + cityName + "$", "i")
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    const hotelIndex = city.hotels.findIndex(h => h.id === hotelId);
    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Remove hotel images from server
    const hotel = city.hotels[hotelIndex];
    const imagesToDelete = [...(hotel.image || []), ...(hotel.detailsImage || [])];
    
    // Delete image files
    imagesToDelete.forEach(imgPath => {
      if (!imgPath.startsWith('http')) {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    });

    // Remove hotel from array
    city.hotels.splice(hotelIndex, 1);
    await city.save();

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;