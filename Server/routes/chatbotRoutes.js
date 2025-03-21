const express = require("express");
const router = express.Router();

// Enhanced responses with more keywords and categories
const responses = {
  // Greetings
  greetings: {
    keywords: [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good evening",
      "good afternoon",
    ],
    response: "Hello! Welcome to HeavenHub. How may I help you today? 👋",
  },

  // Booking related
  booking: {
    keywords: ["book", "reserve", "reservation", "stay", "accommodation"],
    response:
      "You can book a hotel room through our website. Would you like to know about:\n1. Available rooms\n2. Booking process\n3. Current offers",
  },

  // Room related
  rooms: {
    keywords: ["room", "suite", "accommodation", "stay", "bed"],
    response:
      "We offer several room types:\n• Standard Room (2 persons)\n• Deluxe Room (2-3 persons)\n• Family Suite (4 persons)\n• Executive Suite (2 persons)\nWhich would you like to know more about?",
  },

  // Price related
  pricing: {
    keywords: ["price", "cost", "rate", "charges", "fee", "expensive", "cheap"],
    response:
      "Our rates vary by season:\nStandard: $100-150/night\nDeluxe: $150-200/night\nSuite: $250-350/night\nWould you like to check prices for specific dates?",
  },

  // Facilities
  facilities: {
    keywords: [
      "facility",
      "amenities",
      "pool",
      "gym",
      "wifi",
      "restaurant",
      "parking",
    ],
    response:
      "Our hotel features:\n✓ 24/7 Room Service\n✓ Swimming Pool\n✓ Fitness Center\n✓ Free Wi-Fi\n✓ Restaurant\n✓ Secure Parking",
  },

  // Location
  location: {
    keywords: ["where", "location", "address", "direction", "find", "reach"],
    response:
      "We're located in the heart of the city at [Your Hotel Address]. Nearby landmarks:\n• City Center (0.5 km)\n• Airport (10 km)\n• Shopping Mall (1 km)",
  },

  // Check-in/out
  timing: {
    keywords: ["check in", "check out", "timing", "time", "early", "late"],
    response:
      "Check-in: 2:00 PM\nCheck-out: 11:00 AM\nEarly check-in and late check-out available upon request and subject to availability.",
  },

  // Payment
  payment: {
    keywords: ["pay", "payment", "card", "cash", "credit", "debit", "refund"],
    response:
      "We accept:\n✓ Credit/Debit Cards\n✓ PayPal\n✓ Bank Transfer\n✓ Cash\nA 10% deposit is required for booking confirmation.",
  },

  // Default response
  default: {
    response:
      "I'm not sure about that. You can ask me about:\n• Room bookings\n• Prices\n• Facilities\n• Location\n• Check-in/out\n• Payment methods",
  },
};

router.post("/chat", (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let response = responses.default.response;

  // Check each category for matching keywords
  for (const category in responses) {
    if (category !== "default") {
      const matchedKeyword = responses[category].keywords?.some((keyword) =>
        userMessage.includes(keyword)
      );

      if (matchedKeyword) {
        response = responses[category].response;
        break;
      }
    }
  }

  res.json({ response });
});

module.exports = router;
