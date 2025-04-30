const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  guestDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    country: String,
  },
  roomCount: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Redeemed", "Used"],
    default: "Pending",
  },
  discountCode: {
    type: String,
    default: null
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  validUntil: {
    type: Date,
    default: null
  },
  type: {
    type: String,
    enum: ["booking", "redemption"],
    default: "booking"
  }
});

module.exports = mongoose.model("Booking", bookingSchema);