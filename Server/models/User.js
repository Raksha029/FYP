const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  country: { type: String, default: "" },
  mobileNumber: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  }, // Only required if googleId is not set
  verified: { type: Boolean, default: false },
  googleId: { type: String }, // Google OAuth ID
  googleProfilePic: { type: String, default: null }, // Store Google Profile Picture URL
  googleDisplayName: { type: String }, // Store Google Display Name
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  profilePicture: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;