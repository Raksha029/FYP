const express = require('express');
const router = express.Router();
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const City = require('../../models/City'); // Changed from Hotel to City

// Get total bookings count
router.get('/bookings/count', async (req, res) => {
  try {
    const count = await Booking.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking count' });
  }
});

// Get total users count
router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count' });
  }
});

// Get total hotels count from cities
router.get('/hotels/count', async (req, res) => {
  try {
    const cities = await City.find({});
    const totalHotels = cities.reduce((total, city) => total + city.hotels.length, 0);
    res.json({ count: totalHotels });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hotels count' });
  }
});

// Update test route to show total hotels
router.get('/test-db', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const cities = await City.find({});
    const totalHotels = cities.reduce((total, city) => total + city.hotels.length, 0);
    
    res.json({
      message: 'Database connection successful',
      counts: {
        users: userCount,
        bookings: bookingCount,
        hotels: totalHotels
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message 
    });
  }
});

module.exports = router;