const express = require("express");
const crypto = require("crypto");
const transporter = require("../config/emailConfig");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Import your user model (if you have it)
const router = express.Router();
require("../config/passport");
const passport = require("passport");
const { authenticateToken } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // For handling file uploads
const cloudinary = require("cloudinary").v2; // Optional: for cloud image storage
const Favorite = require("../models/Favorite"); // Import your favorite model (if you have it)

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, country, mobileNumber, email, password } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      country,
      mobileNumber,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken, // Save the verification token
    });

    await newUser.save();

    // Construct verification URL
    const verificationUrl = `http://localhost:4000/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "Signup successful! Please check your email to verify your account.",
      user: {
        firstName,
        lastName,
        email,
        mobileNumber,
        country,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Signup failed!" });
  }
});

// Email verification route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid verification token." });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect to frontend with success message
    res.redirect("http://localhost:3000?emailVerified=true");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email verification failed!" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Check if user is verified (except for Google-authenticated users)
    if (!user.googleId && !user.verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        country: user.country,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed!" });
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour to reset the password
    await user.save();

    const resetUrl = `http://localhost:3000/change-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send password reset link." });
  }
});

// Change password route
router.post("/change-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token has not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to change password." });
  }
});

// Redirect user to Google's OAuth 2.0 consent page
router.get(
  "/auth/google",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback URL after Google authenticates the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // Generate token if not already done in passport strategy
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Redirect with token and success flag
    res.redirect(
      `http://localhost:3000?googleLoginSuccess=true&token=${token}`
    );
  }
);

// Add this route for fetching user profile
router.get("/api/user-profile", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    const userData = {
      firstName: user.firstName || user.googleDisplayName || "",
      lastName: user.lastName || "",
      email: user.email,
      mobileNumber: user.mobileNumber || "",
      country: user.country || "",
      profilePicture: user.googleProfilePic || user.profilePicture,
      googleProfilePic: user.googleProfilePic,
      googleId: user.googleId,
      verified: user.verified,
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update Profile Route
router.patch("/api/update-profile", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Validate input
    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "First name and last name are required" });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Upload Profile Picture Route
router.post(
  "/api/upload-profile-picture",
  authenticateToken,
  async (req, res) => {
    try {
      const { profilePicture } = req.body;

      // Validate image size
      if (profilePicture.length > 5 * 1024 * 1024) {
        // 5MB limit
        return res
          .status(413)
          .json({ error: "Image size too large. Maximum 5MB allowed." });
      }

      // Validate base64 image
      if (!profilePicture || !profilePicture.startsWith("data:image")) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      // Compress image before upload
      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        folder: "profile_pictures",
        public_id: `user_${req.user._id}`,
        overwrite: true,
        transformation: [
          { width: 500, height: 500, crop: "limit" }, // Resize image
          { quality: "auto" }, // Automatic quality compression
        ],
      });

      // Update user's profile picture in database
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          profilePicture: uploadResponse.secure_url,
          googleProfilePic: uploadResponse.secure_url,
        },
        { new: true }
      );

      res.json({
        message: "Profile picture updated successfully",
        profilePicture: uploadResponse.secure_url,
      });
    } catch (error) {
      console.error("Full Profile Picture Upload Error:", error);
      res.status(500).json({
        error: "Failed to upload profile picture",
        details: error.message,
      });
    }
  }
);

// Change Password Route
router.post("/api/change-password", authenticateToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new passwords are required" });
    }

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has a password (for Google/OAuth users)
    if (!user.password) {
      return res
        .status(400)
        .json({ error: "Cannot change password for OAuth accounts" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Favorites route
router.get("/favorites", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const favorite = await Favorite.findOne({ user: userId });

    if (!favorite) {
      return res.status(200).json([]); // Return empty array if no favorites
    }

    res.status(200).json(favorite.properties);
  } catch (error) {
    console.error("Fetch Favorites Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

module.exports = router;