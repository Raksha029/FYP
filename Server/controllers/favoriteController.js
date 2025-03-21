const Favorite = require("../models/Favorite");

exports.addFavorite = async (req, res) => {
  try {
    const { propertyId, name, city, image, rating } = req.body;
    const userId = req.user.id;

    if (!propertyId || !name || !userId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    let favorite = await Favorite.findOne({ user: userId });

    if (!favorite) {
      favorite = new Favorite({
        user: userId,
        properties: [],
      });
    }

    // Check if property already exists
    const existingPropertyIndex = favorite.properties.findIndex(
      (prop) => prop.propertyId === propertyId
    );

    if (existingPropertyIndex === -1) {
      favorite.properties.push({
        propertyId,
        name,
        city: city || "",
        image: image || "",
        rating: rating || 0,
        addedAt: new Date(),
      });
    }

    await favorite.save();
    res.status(200).json({
      message: "Property added to favorites",
      property: favorite.properties[favorite.properties.length - 1],
    });
  } catch (error) {
    console.error("Add Favorite Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ user: userId });

    if (favorite) {
      favorite.properties = favorite.properties.filter(
        (prop) => prop.propertyId !== propertyId
      );

      await favorite.save();
      res.status(200).json({
        message: "Property removed from favorites",
        propertyId,
      });
    } else {
      res.status(404).json({ error: "Favorites not found" });
    }
  } catch (error) {
    console.error("Remove Favorite Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorite = await Favorite.findOne({ user: userId });

    const properties = favorite
      ? favorite.properties.sort((a, b) => b.addedAt - a.addedAt)
      : [];

    res.status(200).json(properties);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};
