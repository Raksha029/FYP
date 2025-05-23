const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require('node-cron');  // Add this at the top with other imports
const Booking = require('./models/Booking');  // Add model imports
const City = require('./models/City');
const moment = require('moment'); // Add moment here at the top level
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const statsRoutes = require('./routes/api/stats');
const user = require('./routes/api/users');
require("dotenv").config(); // Load environment variables
const passport = require("passport");
require("./config/passport");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fileUpload = require('express-fileupload');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true // Add this line
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware for session and passport
const session = require("express-session");
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    
    // Add cron job after successful DB connection
    // Fix the cron job implementation
    cron.schedule('0 3 * * *', async () => {
      try {
        const completedBookings = await Booking.find({
          checkOutDate: { $lt: new Date() },
          status: "Confirmed"
        });
    
        for (const booking of completedBookings) {
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
          
          // Update booking status
          booking.status = "Completed";
          await booking.save();
        }
    
        console.log(`Processed ${completedBookings.length} completed bookings`);
      } catch (err) {
        console.error('Error processing completed bookings:', err);
      }
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Routes
// Move this before the routes
// Update the fileUpload middleware configuration
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB
  debug: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Add a new static route for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Then your routes
app.use(authRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

// Routes
const cityRoutes = require("./routes/cityRoutes");
app.use("/api/cities", cityRoutes);

// Add these lines to serve static files
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add admin routes
// Add this line with your other app.use statements
app.use("/api/admin", adminRoutes);

// Add the stats routes
app.use('/api', statsRoutes);

// Add the users routes
app.use('/api', user);