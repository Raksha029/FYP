const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

router.post("/search-hotels", async (req, res) => {
  const { location, checkIn, checkOut, adults, children, rooms } = req.body;

  console.log("Received Search Parameters:", {
    location,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
  });

  try {
    const parsedCheckIn = new Date(checkIn);
    const parsedCheckOut = new Date(checkOut);

    console.log("Parsed Dates:", {
      checkIn: parsedCheckIn,
      checkOut: parsedCheckOut,
    });

    const availableHotels = await Hotel.aggregate([
      // Debugging: Log each stage of aggregation
      {
        $match: {
          city: { $regex: location, $options: "i" },
        },
      },

      {
        $addFields: {
          availableRooms: {
            $filter: {
              input: "$rooms",
              as: "room",
              cond: {
                $and: [
                  // Capacity check
                  { $gte: ["$$room.maxOccupancy", adults + children] },

                  // Room count check
                  { $gte: ["$$room.availableCount", rooms] },

                  // Date availability check
                  {
                    $or: [
                      { $eq: ["$$room.bookings", []] },
                      {
                        $not: {
                          $anyElementTrue: [
                            {
                              $map: {
                                input: "$$room.bookings",
                                as: "booking",
                                in: {
                                  $and: [
                                    {
                                      $lte: [
                                        "$$booking.checkIn",
                                        parsedCheckOut,
                                      ],
                                    },
                                    {
                                      $gte: [
                                        "$$booking.checkOut",
                                        parsedCheckIn,
                                      ],
                                    },
                                  ],
                                },
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      },

      // Debugging: Log hotels before final filtering
      {
        $match: {
          "availableRooms.0": { $exists: true },
        },
      },

      {
        $project: {
          name: 1,
          city: 1,
          location: 1,
          price: 1,
          availableRooms: 1,
          images: 1,
          rating: 1,
          amenities: 1,
          coords: 1,
        },
      },
    ]);

    console.log("Available Hotels:", availableHotels);

    res.json(availableHotels);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Search failed",
      error: error.message,
    });
  }
});

module.exports = router;
