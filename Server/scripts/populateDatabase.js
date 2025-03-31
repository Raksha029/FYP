require("dotenv").config();
const mongoose = require("mongoose");
const City = require("../models/City.js");
const { citiesData } = require("../data/citiesData.js");

async function populateDatabase() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    // Clear existing data
    await City.deleteMany({});
    console.log("Cleared existing data");

    // Transform citiesData into array format
    const cities = Object.entries(citiesData).map(([key, value]) => ({
      name: value.name,
      referencePoint: value.referencePoint,
      centerName: value.centerName,
      hotels: value.hotels.map((hotel) => ({
        ...hotel,
        reviews: hotel.reviews || [], // Ensure reviews exist
        image: hotel.image || [],
        detailsImage: hotel.detailsImage || [],
      })),
    }));

    // Insert the data
    const result = await City.insertMany(cities);
    console.log(`Successfully inserted ${result.length} cities`);
    console.log("Sample data:", result[0].name); // Log first city for verification
  } catch (error) {
    console.error("Error populating database:", error);
    console.error("Detailed error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

populateDatabase();