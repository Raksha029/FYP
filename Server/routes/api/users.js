const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware to verify admin token
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

// Get all users (protected route)
router.get('/admin/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Create new user (protected route)
router.post('/admin/users/create', verifyAdminToken, async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileNumber, country } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with verified set to true
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      mobileNumber,
      country,
      verified: true  // Changed from false to true
    });

    await newUser.save();
    
    // Remove sensitive data before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Update user (protected route)
router.put('/admin/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobileNumber, country } = req.body;
    const userId = req.params.id;

    const updateData = {
      email,
      firstName,
      lastName,
      mobileNumber,
      country
    };

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (protected route)
router.delete('/admin/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;