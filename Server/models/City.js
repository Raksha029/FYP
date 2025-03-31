const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: String,
  price: Number,
  capacity: String,
  available: Number,
  description: String,
});

const reviewSchema = new mongoose.Schema({
  reviewer: String,
  rating: Number,
  comment: String,
});

const hotelSchema = new mongoose.Schema({
  id: String,
  name: String,
  location: String,
  price: Number,
  rating: Number,
  image: [String], // Array of image paths
  detailsImage: [String], // Array of detailed image paths
  description: String,
  amenities: [String],
  coords: {
    type: [Number],
    required: true,
  },
  rooms: [roomSchema],
  reviews: [reviewSchema],
});

const citySchema = new mongoose.Schema({
  name: String,
  referencePoint: {
    lat: Number,
    lon: Number,
  },
  centerName: String,
  hotels: [hotelSchema],
});

module.exports = mongoose.model("City", citySchema);