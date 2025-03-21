const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    properties: [
      {
        propertyId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        city: String,
        image: String,
        rating: Number,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Ensure unique properties for a user
FavoriteSchema.index({ user: 1, "properties.propertyId": 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
