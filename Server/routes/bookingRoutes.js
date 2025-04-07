const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const City = require("../models/City");
const { authenticateToken } = require("../middleware/authMiddleware");

// Create a new booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Validate required fields
    const requiredFields = ['hotelId', 'hotelName', 'roomType', 'checkInDate', 'checkOutDate', 'totalPrice'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Check room availability first
    const cityWithHotel = await City.findOne({ "hotels.id": req.body.hotelId });
    if (!cityWithHotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const hotel = cityWithHotel.hotels.find(h => h.id === req.body.hotelId);
    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const room = hotel.rooms.find(r => r.type === req.body.roomType);
    if (!room) {
      return res.status(404).json({ error: "Room type not found" });
    }

    if (!room.available || room.available < (req.body.roomCount || 1)) {
      return res.status(400).json({ error: "Room not available" });
    }

    // Create booking
    const booking = new Booking({
      userId,
      hotelId: req.body.hotelId,
      hotelName: req.body.hotelName,
      roomType: req.body.roomType,
      checkInDate: new Date(req.body.checkInDate),
      checkOutDate: new Date(req.body.checkOutDate),
      guestDetails: req.body.guestDetails,
      roomCount: req.body.roomCount || 1,
      totalPrice: req.body.totalPrice,
      status: "Confirmed"
    });

    await booking.save();

    // Update room availability
    room.available -= (req.body.roomCount || 1);
    await cityWithHotel.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error("Server booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get all bookings for the current user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();

    // Find all bookings for this user
    const bookings = await Booking.find({ userId });

    // Update expired bookings
    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const checkOutDate = new Date(booking.checkOutDate);
        if (checkOutDate < currentDate && booking.status === "Confirmed") {
          booking.status = "Completed";
          await booking.save();
        }
        return booking;
      })
    );

    // Separate into recent and past bookings
    const recentBookings = updatedBookings.filter(
      (booking) => 
        booking.status === "Confirmed" && 
        new Date(booking.checkOutDate) >= currentDate
    );

    const pastBookings = updatedBookings.filter(
      (booking) => 
        booking.status === "Cancelled" || 
        booking.status === "Completed" ||
        new Date(booking.checkOutDate) < currentDate
    );

    res.json({ recentBookings, pastBookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Cancel booking route
router.post("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    // Find the booking
    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update status to cancelled
    booking.status = "Cancelled";
    await booking.save();

    // Restore room availability
    const cityWithHotel = await City.findOne({ "hotels.id": booking.hotelId });
    if (cityWithHotel) {
      const hotel = cityWithHotel.hotels.find(h => h.id === booking.hotelId);
      if (hotel) {
        const room = hotel.rooms.find(r => r.type === booking.roomType);
        if (room) {
          room.available += booking.roomCount;
          await cityWithHotel.save();
        }
      }
    }

    // Get updated bookings for response
    const currentDate = new Date();
    const allBookings = await Booking.find({ userId });
    
    const recentBookings = allBookings.filter(
      b => b.status === "Confirmed" && new Date(b.checkOutDate) >= currentDate
    );
    
    const pastBookings = allBookings.filter(
      b => b.status === "Cancelled" || 
          b.status === "Completed" || 
          new Date(b.checkOutDate) < currentDate
    );

    res.json({ 
      message: "Booking cancelled successfully", 
      recentBookings,
      pastBookings
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
});

module.exports = router;