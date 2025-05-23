const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const City = require("../models/City");
const { authenticateToken } = require("../middleware/authMiddleware");
const User = require("../models/User");
const nodemailer = require("nodemailer");
// Remove the moment import from here as it's now available globally

// Create a new booking
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check for existing booking with same transaction ID
    if (req.body.transactionId) {
      const existingBooking = await Booking.findOne({ transactionId: req.body.transactionId });
      if (existingBooking) {
        return res.status(200).json({ message: "Booking already exists", booking: existingBooking });
      }
    }

    // Validate required fields
    const requiredFields = ['hotelId', 'hotelName', 'roomType', 'checkInDate', 'checkOutDate', 'totalPrice'];
    for (const field of requiredFields) {
      if (!req.body[field] === undefined) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Check room availability
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

    // Handle discount validation
    if (req.body.discountCode) {
      const validDiscount = await Booking.findOne({
        discountCode: req.body.discountCode,
        hotelId: req.body.hotelId, // Ensure discount is for this specific hotel
        status: 'Redeemed',
        validUntil: { $gt: new Date() }
      });

      if (!validDiscount) {
        return res.status(400).json({ error: "Invalid or expired discount code" });
      }

      // Verify the discount belongs to the current user
      if (validDiscount.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "Unauthorized discount code" });
      }

      // Update the discount booking status
      validDiscount.status = 'Used';
      await validDiscount.save();
    } else {
      // Remove any discount-related fields if no discount is applied
      delete req.body.discountCode;
      delete req.body.discountPercentage;
    }

    // Create the booking
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
      currency: req.body.currency || 'NPR',
      status: "Confirmed",
      discountCode: req.body.discountCode,
      discountPercentage: req.body.discountPercentage
    });

    await booking.save();

    // Add email notification
const transporter = nodemailer.createTransport({service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Get user email
const user = await User.findById(userId);
const mailOptions = {
  from: process.env.EMAIL,
  to: user.email,subject: 'Hotel Booking Confirmation',
  html: ` <h2>Your Booking is Confirmed!</h2>
    <p>Thank you for choosing our hotel. Here are your booking details:</p>
    details:</p>
    <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
    <p><strong>Hotel:</strong> ${req.body.hotelName}</p>
      <p><strong>Room Type:</strong> ${req.body.roomType}</p>
      </p>
      <p><strong>Number of Rooms:</strong> ${req.body.roomCount || 1}</p>
      <p><strong>Check-in Date:</strong> ${new Date(req.body.checkInDate).toLocaleDateString()}</p>
      <p><strong>Check-out Date:</strong> ${new Date(req.body.checkOutDate).toLocaleDateString()}</p>
        <p><strong>Total Price:</strong> ${booking.currency === 'USD' ? '$' : '₨'} ${booking.totalPrice.toLocaleString()}</p>
      </div>
    <p>We look forward to welcoming you!</p>
  `
};

await transporter.sendMail(mailOptions);

    // Update room availability
    room.available -= (req.body.roomCount || 1);
    await cityWithHotel.save();

    // Only add points for non-discounted bookings
    if (!req.body.discountCode) {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { loyaltyPoints: 100 } },
        { new: true }
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("Server booking error:", error);
    res.status(500).json({ error: error.message });
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

// Update the cancel booking route
router.post("/:bookingId/cancel", authenticateToken, async (req, res) => {
  try {
    // Find the booking and populate user details
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    // Check if booking is already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Find the city and update room availability
    const cityWithHotel = await City.findOne({ "hotels.id": booking.hotelId });
    if (!cityWithHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Find the specific hotel
    const hotelIndex = cityWithHotel.hotels.findIndex(h => h.id === booking.hotelId);
    if (hotelIndex === -1) {
      return res.status(404).json({ message: "Hotel not found in city" });
    }

    // Find the specific room type
    const roomIndex = cityWithHotel.hotels[hotelIndex].rooms.findIndex(
      r => r.type === booking.roomType
    );
    if (roomIndex === -1) {
      return res.status(404).json({ message: "Room type not found" });
    }

    // Update room availability
    cityWithHotel.hotels[hotelIndex].rooms[roomIndex].available += booking.roomCount;

    // Save the city document with updated room availability
    await cityWithHotel.save();

    // Update booking status
    booking.status = "Cancelled";
    await booking.save();



    // Update user points (deduct cancellation penalty)
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { loyaltyPoints: -100 } }, // Deduct 100 points for cancellation
      { new: true }
    );

    const transporter = nodemailer.createTransport({ service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }});

      // In the cancel booking route, update the mailOptions template
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Booking Cancellation Confirmation',
        html: `<h2>Booking Cancellation Confirmation</h2>
          <p>Your booking has been cancelled successfully.</p>
          <div style="padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            <p><strong>Hotel:</strong> ${booking.hotelName}</p>
            <p><strong>Room Type:</strong> ${booking.roomType}</p>
            <p><strong>Number of Rooms:</strong> ${booking.roomCount}</p>
            <p><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> ${booking.currency === 'USD' ? '$' : '₨'} ${booking.totalPrice}</p>
          </div>
          <p>We hope to serve you again in the future!</p>
        `
      };
await transporter.sendMail(mailOptions);


    res.json({
      message: "Booking cancelled successfully",
      newPoints: user.loyaltyPoints,
      roomsReturned: booking.roomCount
    });

 
  } catch (error) {
    console.error("Error in booking cancellation:", error);
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
});


const moment = require('moment');


router.get("/weekly-deals", authenticateToken, async (req, res) => {
  try {
    const currentWeek = moment().week();
    const currentYear = moment().year();
    
    const cities = await City.find({});
    
    const weeklyDeals = cities.reduce((deals, city) => {
      if (!city.hotels || city.hotels.length === 0) return deals;
      
      const hotelIndex = Math.floor(
        (currentWeek + parseInt(city._id.toString().slice(-4), 16)) % city.hotels.length
      );
      
      const selectedHotel = city.hotels[hotelIndex];
      if (selectedHotel) {
        deals.push({
          cityName: city.name,
          hotelId: selectedHotel.id,
          hotelName: selectedHotel.name,
          hotelImage: selectedHotel.image || selectedHotel.detailsImage?.[0] || '', // Fix image property
          location: selectedHotel.location,
          pointsRequired: 500,
          discountPercentage: 20,
          validUntil: moment().endOf('week').format('YYYY-MM-DD'),
        });
      }
      
      return deals;
    }, []);

    res.json(weeklyDeals);
  } catch (error) {
    console.error('Error getting weekly deals:', error);
    res.status(500).json({ message: "Error fetching weekly deals" });
  }
});

// Add this new route to get all bookings including redemptions
router.get("/all-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ 
      userId,
      $or: [
        { type: 'booking' },
        { type: 'redemption' }
      ]
    }).sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this route for redeeming points
// Update the redemption booking creation
router.post("/redeem-points", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // First check if user has enough points
    const user = await User.findById(userId);
    if (!user || user.loyaltyPoints < 500) {
      return res.status(400).json({ 
        error: "Insufficient points. You need to earn points through bookings first." 
      });
    }

    const {
      hotelId,
      hotelName,
      pointsToRedeem,
      cityName
    } = req.body;

    // Create redemption booking with all required fields
    const redemptionBooking = new Booking({
      userId,
      hotelId,
      hotelName,
      type: 'redemption',
      status: 'Redeemed',
      loyaltyPoints: -pointsToRedeem,
      checkInDate: new Date(), // Set temporary date
      checkOutDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set temporary date
      roomType: 'Standard', // Set temporary room type
      totalPrice: 0,
      discountCode: `LOYALTY${Date.now()}`,
      discountPercentage: 20,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      guestDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: ''
      },
      roomCount: 1
    });

    await redemptionBooking.save();

    // Deduct points from user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: -pointsToRedeem } },
      { new: true }
    );

    res.json({
      success: true,
      remainingPoints: updatedUser.loyaltyPoints,
      discountCode: redemptionBooking.discountCode,
      bookingId: redemptionBooking._id
    });
  } catch (error) {
    console.error('Error in redeem-points:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update the main booking route to handle points correctly
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // If this is a redemption booking, check if there's already a "Used" status booking
    if (req.body.discountCode && req.body.type === "booking") {
      const existingRedemption = await Booking.findOne({
        discountCode: req.body.discountCode,
        status: "Used",
        userId: userId
      });

      if (!existingRedemption) {
        return res.status(400).json({ error: "Invalid redemption attempt" });
      }

      // Update the existing redemption booking instead of creating a new one
      existingRedemption.roomType = req.body.roomType;
      existingRedemption.checkInDate = req.body.checkInDate;
      existingRedemption.checkOutDate = req.body.checkOutDate;
      existingRedemption.guestDetails = req.body.guestDetails;
      existingRedemption.totalPrice = req.body.totalPrice;
      existingRedemption.status = "Confirmed";
      await existingRedemption.save();

      return res.status(200).json({
        message: "Booking confirmed successfully",
        booking: existingRedemption
      });
    }

    // For non-redemption bookings or initial redemption creation, continue with normal flow
    const booking = new Booking({
      userId,
      ...req.body
    });

    await booking.save();
    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});
// Add this function at the top of the file after the imports
const updateRoomAvailability = async () => {
  try {
    // Get all confirmed bookings
    const bookings = await Booking.find({
      status: "Confirmed",
      checkOutDate: { $lt: new Date() }
    });

    for (const booking of bookings) {
      // Find the city and hotel
      const cityWithHotel = await City.findOne({ "hotels.id": booking.hotelId });
      if (cityWithHotel) {
        const hotelIndex = cityWithHotel.hotels.findIndex(h => h.id === booking.hotelId);
        if (hotelIndex !== -1) {
          const roomIndex = cityWithHotel.hotels[hotelIndex].rooms.findIndex(
            r => r.type === booking.roomType
          );

          if (roomIndex !== -1) {
            // Restore room availability
            cityWithHotel.hotels[hotelIndex].rooms[roomIndex].available += booking.roomCount;
            await cityWithHotel.save();
          }
        }
      }
      
      // Update booking status to completed
      booking.status = "Completed";
      await booking.save();
    }
  } catch (error) {
    console.error('Error updating room availability:', error);
  }
};

// Add this middleware to check availability before each request
router.use(async (req, res, next) => {
  await updateRoomAvailability();
  next();
});
// Add points update route
router.post("/update-points", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { points, type, hotelName } = req.body;

    // Update user's loyalty points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { loyaltyPoints: points } },
      { new: true }
    );

    // Create a points history record
    const pointsBooking = new Booking({
      userId,
      hotelId: 'system',
      hotelName: hotelName,
      roomType: 'N/A',
      checkInDate: new Date(),
      checkOutDate: new Date(),
      totalPrice: 0,
      status: 'Completed',
      type: type,
      pointsAdjustment: points
    });

    await pointsBooking.save();

    res.json({ 
      message: 'Points updated successfully',
      newPoints: user.loyaltyPoints 
    });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ error: 'Failed to update points' });
  }
});
module.exports = router;

// Add this new route
router.get('/check/:orderId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      purchase_order_id: req.params.orderId 
    });
    res.json({ exists: !!booking });
  } catch (error) {
    console.error('Error checking booking:', error);
    res.status(500).json({ error: 'Failed to check booking' });
  }
});