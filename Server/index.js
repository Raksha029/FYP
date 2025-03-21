const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
require("dotenv").config(); // Load environment variables
const passport = require("passport");
require("./config/passport");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

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

// Connect to MongoDB using the environment variable
console.log("Mongo URI:", process.env.MONGO_URI); // This should log your Mongo URI

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
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
app.use("/api", hotelRoutes);
// Start the server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
