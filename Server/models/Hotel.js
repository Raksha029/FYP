const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  location: String,
  price: Number,
  rating: Number,
  images: [String],
  amenities: [String],
  rooms: [
    {
      type: String,
      maxOccupancy: Number,
      availableCount: Number,
      price: Number,
      bookings: [
        {
          checkIn: Date,
          checkOut: Date,
          guests: Number,
        },
      ],
    },
  ],
  coords: {
    lat: Number,
    lon: Number,
  },
});

module.exports = mongoose.model("Hotel", HotelSchema);
