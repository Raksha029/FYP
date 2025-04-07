const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const statsRoutes = require('./routes/api/stats');
const userRoutes = require('./routes/api/users');
require("dotenv").config(); // Load environment variables
const passport = require("passport");
require("./config/passport");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const app = express();

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Routes
app.use(authRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api", reviewRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);


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
app.use('/api', userRoutes);