const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Import the User model
const jwt = require("jsonwebtoken");
const express = require("express");

// Ensure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const router = express.Router();

// Serialize user for the session
passport.serializeUser((user, done) => {
  // Use user ID to serialize
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

        if (!email) {
          return done(null, false, {
            message: "No email associated with Google account.",
          });
        }

        // Check if a user with the same email already exists
        let user = await User.findOne({ email });

        if (!user) {
          // Create new user with Google details
          user = new User({
            googleId: profile.id,
            googleProfilePic:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : "",
            googleDisplayName: profile.displayName || "Unknown",
            firstName: profile.name ? profile.name.givenName : "",
            lastName: profile.name ? profile.name.familyName : "",
            email,
            verified: true, // Google-authenticated users are automatically verified
            mobileNumber: "", // You can add logic to get mobile number if needed
            country: "", // You might want to extract country information if available
          });

          await user.save();
        } else {
          // Update existing user with Google details if needed
          user.googleId = profile.id;
          user.googleProfilePic =
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : user.googleProfilePic;
          user.firstName = profile.name
            ? profile.name.givenName
            : user.firstName;
          user.lastName = profile.name
            ? profile.name.familyName
            : user.lastName;
          user.verified = true;
          await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        // Attach additional user info to the token
        return done(null, {
          ...user.toObject(),
          token,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Add callback route to handle successful Google login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Successful authentication, redirect home with token
    const token = req.user.token;
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

module.exports = passport;
