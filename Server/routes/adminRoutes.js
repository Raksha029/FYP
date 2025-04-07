const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Booking = require("../models/Booking"); // Add this import
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Add middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Maximum login attempts before account lockout
const MAX_LOGIN_ATTEMPTS = 5;
// Lock duration in minutes
const LOCK_TIME = 30;

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / (1000 * 60));
      return res.status(423).json({
        message: `Account is locked. Try again in ${minutesLeft} minutes`
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      admin.loginAttempts += 1;
      
      if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockUntil = Date.now() + (LOCK_TIME * 60 * 1000);
        await admin.save();
        return res.status(423).json({
          message: `Account locked for ${LOCK_TIME} minutes due to too many failed attempts`
        });
      }
      
      await admin.save();
      return res.status(401).json({
        message: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - admin.loginAttempts} attempts remaining`
      });
    }

    // Reset login attempts and lock if login successful
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    admin.lastLogin = Date.now();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id,
        role: admin.role,
        username: admin.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create initial admin
router.post("/create", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: "Username already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      username,
      password: hashedPassword,
      role: 'admin'  // Changed from 'superadmin' to 'admin'
    });

    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route to your existing adminRoutes.js
// Update the bookings route with authentication
router.get('/bookings/all', verifyAdminToken, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .populate('userId', 'firstName lastName email');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router;