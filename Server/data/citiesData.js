// Helper function to generate random reviews
const generateRandomReviews = () => {
    return Array.from(
      { length: Math.floor(Math.random() * (1000 - 50 + 1)) + 50 },
      (_, i) => ({
        reviewer: `Guest${i + 1}`,
        rating: Math.floor(Math.random() * 2) + 4, // Generates either 4 or 5
        comment: [
          "Exceptional luxury experience",
          "Perfect stay",
          "Outstanding service",
          "Beautiful property",
          "Excellent facilities",
          "Great location",
          "Wonderful staff",
          "Luxurious rooms",
          "Amazing experience",
          "Worth every penny",
          "Highly recommended",
          "Fantastic experience",
          "Superb hospitality",
          "Memorable stay",
          "Perfect getaway",
        ][Math.floor(Math.random() * 15)],
      })
    );
  };
  
  const citiesData = {
    kathmandu: {
      name: "Kathmandu",
      referencePoint: { lat: 27.7172, lon: 85.324 },
      centerName: "Thamel",
      hotels: [
        {
          id: "kth1",
          name: "Hyatt Regency Kathmandu",
          price: 250,
          rating: 4.8,
          location: "Taragaon, Boudha",
          amenities: [
            "5-Star Luxury",
            "Multiple Restaurants",
            "Spa",
            "Pool",
            "Tennis Court",
          ],
          servicesOffered: [
            "24/7 Room Service",
            "Concierge Service",
            "Airport Shuttle",
            "Fitness Center",
            "Business Center",
          ],
          image: ["/images/kathmandu1.png"],
          coords: [27.7172, 85.324],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Hyatt1.jpg",
            "/images/Hyatt2.jpg",
            "/images/Hyatt3.jpeg",
            "/images/Hyatt4.jpeg",
            "/images/Hyatt5.jpeg",
            "/images/Hyatt6.jpg",
            "/images/Hyatt7.jpg",
            "/images/Hyatt8.jpg",
            "/images/Hyatt9.jpeg",
            "/images/Hyatt10.jpg",
          ],
          description:
            "This luxurious room offers stunning views of the Himalayas, perfect for a relaxing getaway.",
          rooms: [
            {
              type: "Himalayan View Room",
              price: 250,
              capacity: "2 Adults",
              available: 10,
              description:
                "Spacious room with breathtaking Himalayan mountain views and modern amenities.",
            },
            {
              type: "Executive Luxury Suite",
              price: 450,
              capacity: "4 Adults",
              available: 5,
              description:
                "Expansive suite with separate living area, panoramic mountain views, and premium services.",
            },
            {
              type: "Family Interconnected Rooms",
              price: 350,
              capacity: "5 Adults",
              available: 3,
              description:
                "Two interconnected rooms perfect for families, featuring city and mountain views.",
            },
          ],
        },
        {
          id: "kth2",
          name: "Dwarika's Hotel",
          price: 300,
          rating: 4.9,
          location: "Battisputali Road",
          amenities: [
            "Heritage Property",
            "Luxury Spa",
            "Cultural Tours",
            "Fine Dining",
          ],
          servicesOffered: [
            "Cultural Experiences",
            "Heritage Tours",
            "Spa Treatments",
            "Fine Dining",
            "Yoga Classes",
          ],
          image: ["/images/kathmandu2.png"],
          coords: [27.7175, 85.3245],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Dwarik1.jpg",
            "/images/Dwarik2.jpg",
            "/images/Dwarik3.jpg",
            "/images/Dwarik4.jpg",
            "/images/Dwarik5.jpg",
            "/images/Dwarik6.jpg",
            "/images/Dwarik7.jpg",
            "/images/Dwarik8.jpeg",
            "/images/Dwarik9.jpg",
            "/images/Dwarik10.jpg",
          ],
          description:
            "Experience heritage and luxury in this beautifully designed suite with traditional decor.",
          rooms: [
            {
              type: "Heritage Deluxe Room",
              price: 300,
              capacity: "2 Adults",
              available: 8,
              description:
                "Traditionally decorated room showcasing authentic Newari architectural elements.",
            },
            {
              type: "Cultural Heritage Suite",
              price: 500,
              capacity: "3 Adults",
              available: 4,
              description:
                "Luxurious suite with handcrafted wooden furnishings and exclusive cultural experiences.",
            },
            {
              type: "Garden View Room",
              price: 250,
              capacity: "2 Adults",
              available: 6,
              description:
                "Serene room overlooking the hotel's meticulously maintained traditional garden.",
            },
          ],
        },
        {
          id: "kth3",
          name: "Yak & Yeti Hotel",
          price: 200,
          rating: 4.7,
          location: "Durbar Marg",
          amenities: [
            "Casino",
            "Multiple Restaurants",
            "Pool",
            "Business Center",
          ],
          servicesOffered: [
            "Casino Access",
            "Event Hosting",
            "Room Service",
            "Fitness Center",
            "Airport Transfers",
          ],
          image: ["/images/kathmandu3.png"],
          coords: [27.7168, 85.3235],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Yak1.png",
            "/images/Yak2.jpg",
            "/images/Yak3.jpg",
            "/images/Yak4.jpg",
            "/images/Yak5.jpg",
            "/images/Yak6.jpeg",
            "/images/Yak7.jpg",
            "/images/Yak8.jpg",
            "/images/Yak9.jpg",
            "/images/Yak10.png",
            "/images/Yak11.png",
          ],
          description:
            "Enjoy a modern stay in this spacious room equipped with all the amenities for a comfortable experience.",
          rooms: [
            {
              type: "Casino Deluxe Room",
              price: 200,
              capacity: "2 Adults",
              available: 12,
              description:
                "Comfortable room with direct access to the hotel's famous casino and entertainment areas.",
            },
            {
              type: "Business Executive Suite",
              price: 350,
              capacity: "3 Adults",
              available: 6,
              description:
                "Fully equipped suite with work desk, meeting area, and premium business facilities.",
            },
            {
              type: "Riverside Luxury Room",
              price: 275,
              capacity: "2 Adults",
              available: 5,
              description:
                "Elegantly designed room with scenic views of the nearby river and city landscape.",
            },
          ],
        },
        {
          id: "kth4",
          name: "Aloft Kathmandu Thamel",
          price: 180,
          rating: 4.6,
          location: "Thamel",
          amenities: ["Modern Design", "Rooftop Bar", "Gym", "Meeting Rooms"],
          servicesOffered: [
            "Rooftop Bar",
            "Live Music Events",
            "Business Facilities",
            "Free Wi-Fi",
            "Laundry Service",
          ],
          image: ["/images/kathmandu4.png"],
          coords: [27.717, 85.3238],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Aloft1.jpg",
            "/images/Aloft2.jpg",
            "/images/Aloft3.jpg",
            "/images/Aloft4.jpg",
          ],
          description:
            "This contemporary room features a rooftop view and is ideal for both leisure and business travelers.",
          rooms: [
            {
              type: "Urban Loft Room",
              price: 180,
              capacity: "2 Adults",
              available: 15,
              description:
                "Modern, minimalist room with contemporary design and city views.",
            },
            {
              type: "Rooftop Experience Suite",
              price: 300,
              capacity: "3 Adults",
              available: 4,
              description:
                "Exclusive suite with private rooftop access and panoramic views of Kathmandu.",
            },
            {
              type: "Social Traveler Room",
              price: 150,
              capacity: "2 Adults",
              available: 8,
              description:
                "Compact, stylish room designed for young travelers with social spaces and modern amenities.",
            },
          ],
        },
        {
          id: "kth5",
          name: "Soaltee Kathmandu",
          price: 190,
          rating: 3.7,
          location: "Tahachal",
          amenities: ["Multiple Restaurants", "Pool", "Spa", "Tennis Court"],
          servicesOffered: [
            "Spa Services",
            "Tennis Courts",
            "Swimming Pool",
            "Kids Club",
            "Airport Shuttle",
          ],
          image: ["/images/kathmandu5.png"],
          coords: [27.7165, 85.323],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Soaltee1.jpg",
            "/images/Soaltee2.png",
            "/images/Soaltee3.jpg",
            "/images/Soaltee4.jpg",
          ],
          description:
            "Relax in this cozy room that combines comfort with modern amenities, perfect for families.",
          rooms: [
            {
              type: "Family Comfort Room",
              price: 190,
              capacity: "4 Adults",
              available: 7,
              description:
                "Spacious room with extra beds and family-friendly amenities.",
            },
            {
              type: "Tennis Court View Suite",
              price: 275,
              capacity: "2 Adults",
              available: 5,
              description:
                "Luxurious suite overlooking the hotel's professional tennis courts.",
            },
            {
              type: "Wellness Retreat Room",
              price: 220,
              capacity: "2 Adults",
              available: 6,
              description:
                "Tranquil room with direct access to spa and wellness center.",
            },
          ],
        },
        {
          id: "kth6",
          name: "Hotel Shangri-La",
          price: 170,
          rating: 3.5,
          location: "Lazimpat",
          amenities: ["Garden", "Restaurant", "Business Center", "Spa"],
          servicesOffered: [
            "Garden Tours",
            "Spa Treatments",
            "Business Services",
            "Room Service",
            "Free Parking",
          ],
          image: ["/images/kathmandu6.png"],
          coords: [27.7177, 85.3248],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Shangri1.png",
            "/images/Shangri2.jpg",
            "/images/Shangri3.jpg",
            "/images/Shangri4.png",
          ],
          description:
            "This elegant room offers a serene atmosphere with access to the hotel's beautiful garden.",
          rooms: [
            {
              type: "Garden Serenity Room",
              price: 150,
              capacity: "2 Adults",
              available: 5,
              description:
                "Peaceful room with direct access to the hotel's lush garden, offering a tranquil retreat.",
            },
            {
              type: "Executive Heritage Suite",
              price: 250,
              capacity: "4 Adults",
              available: 3,
              description:
                "Spacious suite featuring traditional Nepali decor and modern luxury, with a separate living area.",
            },
            {
              type: "City View Comfort Room",
              price: 170,
              capacity: "2 Adults",
              available: 4,
              description:
                "Bright and airy room with panoramic views of Kathmandu's vibrant cityscape.",
            },
          ],
        },
        {
          id: "kth7",
          name: "Marriott Kathmandu",
          price: 220,
          rating: 4.8,
          location: "Naxal",
          amenities: [
            "Luxury Rooms",
            "Executive Lounge",
            "Multiple Restaurants",
            "Spa",
          ],
          servicesOffered: [
            "Executive Lounge Access",
            "Concierge Service",
            "Spa Services",
            "Room Service",
            "Fitness Classes",
          ],
          image: ["/images/kathmandu7.png"],
          coords: [27.7173, 85.3242],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Marriott1.jpg",
            "/images/Marriott2.jpg",
            "/images/Marriott3.jpg",
            "/images/Marriott4.jpg",
            "/images/Marriott5.jpg",
            "/images/Marriott6.jpg",
            "/images/Marriott7.jpg",
            "/images/Marriott8.jpg",
            "/images/Marriott9.jpg",
            "/images/Marriott10.jpg",
            "/images/Marriott11.jpg",
          ],
          description:
            "Indulge in luxury with this spacious suite that includes a private balcony and premium services.",
          rooms: [
            {
              type: "Executive Lounge Access Room",
              price: 220,
              capacity: "2 Adults",
              available: 6,
              description:
                "Sophisticated room with exclusive access to the Marriott Executive Lounge and premium amenities.",
            },
            {
              type: "Luxury Mountain View Suite",
              price: 350,
              capacity: "3 Adults",
              available: 4,
              description:
                "Expansive suite with breathtaking mountain views, featuring a separate living area and premium services.",
            },
            {
              type: "Business Traveler's Retreat",
              price: 190,
              capacity: "2 Adults",
              available: 5,
              description:
                "Fully equipped room designed for business professionals, with a dedicated work area and high-speed internet.",
            },
          ],
        },
        {
          id: "kth8",
          name: "Hotel Annapurna",
          price: 160,
          rating: 4.5,
          location: "Durbar Marg",
          amenities: ["Pool", "Restaurant", "Coffee Shop", "Business Center"],
          servicesOffered: [
            "Swimming Pool",
            "Coffee Shop",
            "Business Services",
            "Room Service",
            "Event Hosting",
          ],
          image: ["/images/kathmandu8.png"],
          coords: [27.7169, 85.3237],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Annapurna1.jpg",
            "/images/Annapurna2.jpg",
            "/images/Annapurna3.jpg",
            "/images/Annapurna4.jpg",
          ],
          description:
            "This charming room provides a perfect blend of comfort and style, ideal for a romantic getaway.",
          rooms: [
            {
              type: "Poolside Comfort Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Relaxing room with direct views of the hotel's swimming pool and easy access to recreational facilities.",
            },
            {
              type: "Culinary Enthusiast Suite",
              price: 250,
              capacity: "4 Adults",
              available: 3,
              description:
                "Spacious suite near the hotel's renowned restaurant, perfect for food lovers and larger groups.",
            },
            {
              type: "Urban Elegance Room",
              price: 180,
              capacity: "2 Adults",
              available: 4,
              description:
                "Stylish room with modern decor, offering a perfect blend of comfort and contemporary design.",
            },
          ],
        },
        {
          id: "kth9",
          name: "Hotel Mulberry",
          price: 150,
          rating: 4.6,
          location: "Thamel",
          amenities: ["Rooftop Pool", "Spa", "Restaurant", "Bar"],
          servicesOffered: [
            "Rooftop Pool Access",
            "Spa Services",
            "Restaurant Reservations",
            "Room Service",
            "Free Wi-Fi",
          ],
          image: ["/images/kathmandu9.png"],
          coords: [27.7171, 85.3239],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Mulberry1.png",
            "/images/Mulberry2.jpg",
            "/images/Mulberry3.jpg",
            "/images/Mulberry4.jpg",
          ],
          description:
            "Experience tranquility in this well-appointed room with modern furnishings and a relaxing ambiance.",
          rooms: [
            {
              type: "Rooftop Pool Access Room",
              price: 150,
              capacity: "2 Adults",
              available: 7,
              description:
                "Chic room with exclusive access to the hotel's stunning rooftop pool and panoramic city views.",
            },
            {
              type: "Wellness Spa Suite",
              price: 280,
              capacity: "3 Adults",
              available: 4,
              description:
                "Luxurious suite with direct access to the hotel's spa, featuring relaxation and rejuvenation amenities.",
            },
            {
              type: "Social Traveler's Loft",
              price: 130,
              capacity: "2 Adults",
              available: 6,
              description:
                "Compact, vibrant room designed for young travelers, with social spaces and modern connectivity.",
            },
          ],
        },
        {
          id: "kth10",
          name: "Hotel Himalaya",
          price: 140,
          rating: 4.4,
          location: "Kupondole",
          amenities: [
            "Garden",
            "Restaurant",
            "Conference Facilities",
            "Tennis Court",
          ],
          servicesOffered: [
            "Conference Facilities",
            "Garden Tours",
            "Room Service",
            "Tennis Courts",
            "Airport Shuttle",
          ],
          image: ["/images/kathmandu10.png"],
          coords: [27.7167, 85.3233],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/Himalaya1.png",
            "/images/Himalaya2.jpg",
            "/images/Himalaya3.png",
            "/images/Himalaya4.jpg",
          ],
          description:
            "This room offers a unique blend of traditional and modern design, ensuring a memorable stay.",
          rooms: [
            {
              type: "Garden Retreat Room",
              price: 140,
              capacity: "2 Adults",
              available: 5,
              description:
                "Serene room overlooking the hotel's beautifully maintained garden, offering a peaceful escape.",
            },
            {
              type: "Conference Companion Suite",
              price: 230,
              capacity: "4 Adults",
              available: 3,
              description:
                "Spacious suite near conference facilities, ideal for business groups or families attending events.",
            },
            {
              type: "Tennis Court View Room",
              price: 170,
              capacity: "2 Adults",
              available: 4,
              description:
                "Unique room with direct views of the hotel's professional tennis courts, perfect for sports enthusiasts.",
            },
          ],
        },
      ],
    },
  
    pokhara: {
      name: "Pokhara",
      referencePoint: { lat: 28.2096, lon: 83.9856 },
      centerName: "Lakeside",
      hotels: [
        {
          id: "pkr1",
          name: "Fish Tail Lodge",
          price: 200,
          rating: 4.8,
          location: "Lakeside North",
          amenities: ["Lake View", "Private Beach", "Restaurant", "Boat Service"],
          servicesOffered: [
            "Boat Rentals",
            "Fishing Tours",
            "Free Breakfast",
            "Spa Services",
            "Airport Transfers",
          ],
          image: ["/images/p9.jpg"],
          coords: [28.2096, 83.9856],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/p9.jpg",
            "/images/p1.jpg",
            "/images/p2.jpg",
            "/images/p3.jpg",
          ],
          description:
            "Enjoy breathtaking views of the lake from this cozy lodge, perfect for a peaceful retreat.",
          rooms: [
            {
              type: "Lakeside Deluxe Room",
              price: 200,
              capacity: "2 Adults",
              available: 8,
              description:
                "Spacious room with panoramic views of Phewa Lake, featuring private balcony and modern amenities.",
            },
            {
              type: "Fisherman's Suite",
              price: 350,
              capacity: "4 Adults",
              available: 4,
              description:
                "Expansive suite with direct lake access, fishing equipment rental, and a private sitting area with lake views.",
            },
            {
              type: "Romantic Waterfront Retreat",
              price: 275,
              capacity: "2 Adults",
              available: 5,
              description:
                "Intimate room designed for couples, with floor-to-ceiling windows offering uninterrupted lake and mountain scenery.",
            },
          ],
        },
        {
          id: "pkr2",
          name: "Temple Tree Resort",
          price: 180,
          rating: 4.7,
          location: "Gaurighat, Lakeside",
          amenities: ["Pool", "Spa", "Mountain Views", "Restaurant"],
          servicesOffered: [
            "Spa Treatments",
            "Yoga Classes",
            "Mountain Tours",
            "Free Wi-Fi",
            "Laundry Service",
          ],
          image: ["/images/p2.jpg"],
          coords: [28.2099, 83.9859],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p2.jpg"],
          description:
            "Relax in this serene resort that offers stunning mountain views and luxurious amenities.",
          rooms: [
            {
              type: "Mountain View Zen Room",
              price: 180,
              capacity: "2 Adults",
              available: 6,
              description:
                "Tranquil room with meditation corner and panoramic views of the Annapurna mountain range.",
            },
            {
              type: "Wellness Sanctuary Suite",
              price: 300,
              capacity: "3 Adults",
              available: 3,
              description:
                "Luxurious suite with private yoga space, spa-like bathroom, and complimentary wellness treatments.",
            },
            {
              type: "Garden Meditation Room",
              price: 220,
              capacity: "2 Adults",
              available: 5,
              description:
                "Serene room overlooking the resort's zen garden, perfect for mindfulness and relaxation.",
            },
          ],
        },
        {
          id: "pkr3",
          name: "Waterfront Resort",
          price: 170,
          rating: 4.6,
          location: "Lakeside South",
          amenities: ["Lake View", "Restaurant", "Bar", "Water Sports"],
          servicesOffered: [
            "Water Sports Rentals",
            "Fishing Tours",
            "Free Breakfast",
            "Spa Services",
            "Airport Shuttle",
          ],
          image: ["/images/p3.jpg"],
          coords: [28.2093, 83.9853],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p3.jpg"],
          description:
            "This resort features direct access to the lake, making it ideal for water sports enthusiasts.",
          rooms: [
            {
              type: "Water Sports Enthusiast Room",
              price: 170,
              capacity: "2 Adults",
              available: 7,
              description:
                "Adventure-ready room with complimentary water sports equipment and direct lake access.",
            },
            {
              type: "Sunset Lounge Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Expansive suite with a private terrace offering breathtaking sunset views over Phewa Lake.",
            },
            {
              type: "Kayaker's Retreat",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Specially designed room for water sports lovers, with secure equipment storage and quick lake access.",
            },
          ],
        },
        {
          id: "pkr4",
          name: "Hotel Barahi",
          price: 160,
          rating: 4.7,
          location: "Lakeside",
          amenities: ["Pool", "Spa", "Restaurant", "Mountain Views"],
          servicesOffered: [
            "Spa Services",
            "Free Wi-Fi",
            "Room Service",
            "Airport Transfers",
            "Cultural Tours",
          ],
          image: ["/images/p4.jpg"],
          coords: [28.2097, 83.9857],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p4.jpg"],
          description:
            "Experience luxury in this hotel with a beautiful pool and stunning views of the surrounding mountains.",
          rooms: [
            {
              type: "Poolside Relaxation Room",
              price: 160,
              capacity: "2 Adults",
              available: 6,
              description:
                "Comfortable room with direct access to the hotel's swimming pool and tropical garden views.",
            },
            {
              type: "Cultural Heritage Suite",
              price: 250,
              capacity: "3 Adults",
              available: 3,
              description:
                "Luxurious suite decorated with traditional Nepali art, offering cultural immersion and modern comfort.",
            },
            {
              type: "Mountain Panorama Room",
              price: 190,
              capacity: "2 Adults",
              available: 5,
              description:
                "Bright room with floor-to-ceiling windows showcasing stunning 180-degree mountain landscapes.",
            },
          ],
        },
        {
          id: "pkr5",
          name: "Atithi Resort & Spa",
          price: 150,
          rating: 4.5,
          location: "Lakeside North",
          amenities: ["Spa", "Pool", "Restaurant", "Garden"],
          servicesOffered: [
            "Spa Treatments",
            "Yoga Classes",
            "Free Breakfast",
            "Room Service",
            "Airport Shuttle",
          ],
          image: ["/images/p5.jpg"],
          coords: [28.21, 83.986],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p5.jpg"],
          description:
            "This resort offers a perfect blend of relaxation and adventure, with a full-service spa and outdoor activities.",
          rooms: [
            {
              type: "Wellness Rejuvenation Room",
              price: 150,
              capacity: "2 Adults",
              available: 7,
              description:
                "Spa-inspired room with aromatherapy setup, meditation corner, and complimentary wellness treatments.",
            },
            {
              type: "Family Garden Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Spacious family suite with a private garden area, children's play zone, and interconnected rooms.",
            },
            {
              type: "Lakeside Meditation Room",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Tranquil room with a zen-like atmosphere, offering partial lake views and yoga mat provisions.",
            },
          ],
        },
        {
          id: "pkr6",
          name: "Hotel Grande International",
          price: 190,
          rating: 4.8,
          location: "Airport Road",
          amenities: ["Business Center", "Multiple Restaurants", "Spa", "Pool"],
          servicesOffered: [
            "Business Services",
            "Free Wi-Fi",
            "Room Service",
            "Airport Transfers",
            "Laundry Service",
          ],
          image: ["/images/p6.jpg"],
          coords: [28.2095, 83.9855],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p6.jpg"],
          description:
            "Ideal for business travelers, this hotel combines comfort with modern amenities and excellent service.",
          rooms: [
            {
              type: "Business Executive Room",
              price: 190,
              capacity: "2 Adults",
              available: 6,
              description:
                "Fully equipped room for business travelers, featuring a dedicated workspace and high-speed internet.",
            },
            {
              type: "Corporate Conference Suite",
              price: 350,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite with meeting facilities, private work area, and comprehensive business services.",
            },
            {
              type: "Digital Nomad Workspace Room",
              price: 220,
              capacity: "2 Adults",
              available: 5,
              description:
                "Modern room designed for remote workers, with ergonomic workspace and advanced connectivity options.",
            },
          ],
        },
        {
          id: "pkr7",
          name: "Hotel Middle Path",
          price: 130,
          rating: 4.4,
          location: "Central Lakeside",
          amenities: ["Restaurant", "Rooftop", "Lake View", "Bar"],
          servicesOffered: [
            "Rooftop Bar",
            "Free Wi-Fi",
            "Room Service",
            "Airport Shuttle",
            "Cultural Tours",
          ],
          image: ["/images/p7.jpg"],
          coords: [28.2098, 83.9858],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p7.jpg"],
          description:
            "This hotel features a rooftop bar with stunning views, perfect for enjoying the sunset over the lake.",
          rooms: [
            {
              type: "Rooftop Sunset Room",
              price: 130,
              capacity: "2 Adults",
              available: 5,
              description:
                "Intimate room with exclusive rooftop bar access and panoramic sunset views of Pokhara.",
            },
            {
              type: "Cultural Immersion Suite",
              price: 250,
              capacity: "3 Adults",
              available: 3,
              description:
                "Spacious suite showcasing local art, offering cultural workshops and traditional decor.",
            },
            {
              type: "Backpacker's Social Room",
              price: 100,
              capacity: "2 Adults",
              available: 6,
              description:
                "Budget-friendly room with communal spaces, perfect for solo travelers and social interactions.",
            },
          ],
        },
        {
          id: "pkr8",
          name: "Hotel Mountain View",
          price: 140,
          rating: 4.5,
          location: "Sarangkot Road",
          amenities: ["Mountain Views", "Restaurant", "Trekking Desk", "Garden"],
          servicesOffered: [
            "Trekking Tours",
            "Free Breakfast",
            "Room Service",
            "Airport Transfers",
            "Yoga Classes",
          ],
          image: ["/images/p8.jpg"],
          coords: [28.2092, 83.9852],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p8.jpg"],
          description:
            "Enjoy breathtaking mountain views from this hotel, which is also a great base for trekking adventures.",
          rooms: [
            {
              type: "Trekkers' Base Camp Room",
              price: 140,
              capacity: "2 Adults",
              available: 7,
              description:
                "Adventure-ready room with trekking gear storage, maps, and mountain expedition resources.",
            },
            {
              type: "Panoramic Peak Suite",
              price: 300,
              capacity: "4 Adults",
              available: 4,
              description:
                "Luxurious suite with unobstructed views of the Annapurna and Machhapuchhre mountain ranges.",
            },
            {
              type: "Yoga and Meditation Retreat Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Serene room designed for mindfulness, with yoga mat, meditation cushions, and mountain views.",
            },
          ],
        },
        {
          id: "pkr9",
          name: "Pokhara Grande",
          price: 210,
          rating: 4.9,
          location: "North Lake Side",
          amenities: ["Luxury Rooms", "Pool", "Spa", "Multiple Restaurants"],
          servicesOffered: [
            "Luxury Spa",
            "Free Wi-Fi",
            "Room Service",
            "Airport Shuttle",
            "Cultural Tours",
          ],
          image: ["/images/p1.jpg"],
          coords: [28.2101, 83.9861],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p1.jpg"],
          description:
            "This luxury hotel offers spacious rooms and top-notch amenities, ensuring a memorable stay.",
          rooms: [
            {
              type: "Luxury Lakeside Room",
              price: 210,
              capacity: "2 Adults",
              available: 6,
              description:
                "Elegantly designed room with direct lake views, premium furnishings, and personalized service.",
            },
            {
              type: "Royal Spa Suite",
              price: 450,
              capacity: "3 Adults",
              available: 3,
              description:
                "Ultimate luxury suite with private spa facilities, jacuzzi, and 24-hour personal butler service.",
            },
            {
              type: "Gourmet Culinary Room",
              price: 280,
              capacity: "2 Adults",
              available: 4,
              description:
                "Exclusive room with private dining area, chef's kitchen, and curated culinary experiences.",
            },
          ],
        },
        {
          id: "pkr10",
          name: "Hotel Lake Shore",
          price: 165,
          rating: 4.6,
          location: "South Lake Side",
          amenities: ["Lake Access", "Restaurant", "Water Sports", "Bar"],
          servicesOffered: [
            "Water Sports Rentals",
            "Free Breakfast",
            "Room Service",
            "Airport Transfers",
            "Fishing Tours",
          ],
          image: ["/images/p10.jpg"],
          coords: [28.2094, 83.9854],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/p10.jpg"],
          description:
            "With direct lake access, this hotel is perfect for those looking to enjoy water sports and relaxation.",
          rooms: [
            {
              type: "Water Sports Lover's Room",
              price: 165,
              capacity: "2 Adults",
              available: 7,
              description:
                "Adventure room with complimentary water sports equipment and direct lake beach access.",
            },
            {
              type: "Fishing Enthusiast Suite",
              price: 250,
              capacity: "4 Adults",
              available: 4,
              description:
                "Spacious suite for anglers, featuring fishing gear rental, lake view, and local fishing guide connections.",
            },
            {
              type: "Romantic Lakeside Retreat",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Intimate room designed for couples, with private balcony and uninterrupted lake and mountain scenery.",
            },
          ],
        },
      ],
    },
  
    baktapur: {
      name: "Baktapur",
      referencePoint: { lat: 27.671, lon: 85.4298 },
      centerName: "Durbar Square",
      hotels: [
        {
          id: "bkt1",
          name: "Heritage Hotel Bhaktapur",
          price: 120,
          rating: 4.7,
          location: "Durbar Square Area",
          amenities: [
            "Heritage Building",
            "Restaurant",
            "Cultural Tours",
            "Rooftop",
          ],
          servicesOffered: [
            "Cultural Experiences",
            "Heritage Tours",
            "Free Wi-Fi",
            "Room Service",
            "Airport Shuttle",
          ],
          image: ["/images/b1.jpg"],
          coords: [27.671, 85.4298],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/b1.jpg",
            "/images/b2.jpg",
            "/images/b3.jpg",
            "/images/b4.jpg",
          ],
        },
        {
          id: "bkt2",
          name: "Planet Bhaktapur Hotel",
          price: 90,
          rating: 4.5,
          location: "Pottery Square",
          amenities: [
            "City View",
            "Restaurant",
            "Cultural Activities",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Cultural Activities",
            "Free Breakfast",
            "Room Service",
            "Laundry Service",
            "Local Tours",
          ],
          image: ["/images/b2.jpg"],
          coords: [27.6713, 85.4301],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b2.jpg"],
        },
        {
          id: "bkt3",
          name: "Vajra Guest House",
          price: 80,
          rating: 4.4,
          location: "Taumadhi Square",
          amenities: ["Traditional Rooms", "Restaurant", "Temple View", "Garden"],
          servicesOffered: [
            "Traditional Meals",
            "Free Wi-Fi",
            "Cultural Tours",
            "Room Service",
            "Garden Access",
          ],
          image: ["/images/b3.jpg"],
          coords: [27.6708, 85.4296],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b3.jpg"],
        },
        {
          id: "bkt4",
          name: "Hotel Sweet Home",
          price: 70,
          rating: 4.3,
          location: "Dattatreya Square",
          amenities: [
            "Family Rooms",
            "Restaurant",
            "Cultural Tours",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Family Activities",
            "Free Breakfast",
            "Room Service",
            "Laundry Service",
            "Local Tours",
          ],
          image: ["/images/b4.jpg"],
          coords: [27.6712, 85.43],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b4.jpg"],
        },
        {
          id: "bkt5",
          name: "Bhaktapur Paradise Hotel",
          price: 130,
          rating: 4.8,
          location: "Durbar Square",
          amenities: ["Premium Rooms", "Restaurant", "Spa", "Heritage Tours"],
          servicesOffered: [
            "Spa Services",
            "Cultural Experiences",
            "Free Wi-Fi",
            "Room Service",
            "Heritage Tours",
          ],
          image: ["/images/b5.jpg"],
          coords: [27.6711, 85.4299],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b5.jpg"],
        },
        {
          id: "bkt6",
          name: "Traditional Stay",
          price: 85,
          rating: 4.4,
          location: "Pottery Square",
          amenities: [
            "Cultural Experience",
            "Restaurant",
            "Pottery Classes",
            "Garden",
          ],
          servicesOffered: [
            "Pottery Classes",
            "Cultural Experiences",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
          ],
          image: ["/images/b6.jpg"],
          coords: [27.6709, 85.4297],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b6.jpg"],
        },
        {
          id: "bkt7",
          name: "Hotel Heritage Palace",
          price: 140,
          rating: 4.6,
          location: "Near Nyatapola Temple",
          amenities: [
            "Temple View",
            "Restaurant",
            "Luxury Rooms",
            "Cultural Tours",
          ],
          servicesOffered: [
            "Luxury Dining",
            "Cultural Tours",
            "Free Wi-Fi",
            "Room Service",
            "Temple Visits",
          ],
          image: ["/images/b7.jpg"],
          coords: [27.6714, 85.4302],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b7.jpg"],
        },
        {
          id: "bkt8",
          name: "Bhaktapur Homestay",
          price: 60,
          rating: 4.3,
          location: "Old Town",
          amenities: [
            "Local Experience",
            "Home Cooking",
            "Cultural Activities",
            "Garden",
          ],
          servicesOffered: [
            "Home-Cooked Meals",
            "Cultural Activities",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
          ],
          image: ["/images/b8.jpg"],
          coords: [27.6707, 85.4295],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b8.jpg"],
        },
        {
          id: "bkt9",
          name: "Royal Bhaktapur",
          price: 150,
          rating: 4.7,
          location: "Durbar Square Area",
          amenities: ["Luxury Rooms", "Restaurant", "Spa", "Heritage Tours"],
          servicesOffered: [
            "Luxury Spa",
            "Cultural Experiences",
            "Free Wi-Fi",
            "Room Service",
            "Heritage Tours",
          ],
          image: ["/images/b9.jpg"],
          coords: [27.6715, 85.4303],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b9.jpg"],
        },
        {
          id: "bkt10",
          name: "Cultural Resort Bhaktapur",
          price: 110,
          rating: 4.5,
          location: "Changu Narayan Road",
          amenities: [
            "Mountain View",
            "Restaurant",
            "Cultural Programs",
            "Garden",
          ],
          servicesOffered: [
            "Cultural Programs",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
            "Garden Access",
          ],
          image: ["/images/b10.jpg"],
          coords: [27.6706, 85.4294],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/b10.jpg"],
        },
      ],
    },
  
    lalitpur: {
      name: "Lalitpur",
      referencePoint: { lat: 27.6766, lon: 85.3241 },
      centerName: "Patan Durbar Square",
      hotels: [
        {
          id: "lal1",
          name: "Hotel Summit Patan",
          price: 110,
          rating: 4.6,
          location: "Patan Durbar Square, Lalitpur",
          amenities: [
            "Free Wi-Fi",
            "Rooftop Restaurant",
            "Cultural Tours",
            "Heritage Views",
          ],
          servicesOffered: [
            "Rooftop Dining",
            "Cultural Tours",
            "Free Breakfast",
            "Room Service",
            "Heritage Experiences",
          ],
          image: ["/images/li1.jpg"],
          coords: [27.6766, 85.3241],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/li1.jpg",
            "/images/li2.jpg",
            "/images/li3.jpg",
            "/images/li4.jpg",
          ],
          description:
            "This hotel offers stunning views of Patan Durbar Square and a rooftop restaurant for a unique dining experience.",
          rooms: [
            {
              type: "Patan Square Heritage Room",
              price: 150,
              capacity: "2 Adults",
              available: 5,
              description:
                "Elegantly designed room offering panoramic views of Patan Durbar Square, featuring traditional Newari architectural elements and curated local artwork.",
            },
            {
              type: "Cultural Immersion Suite",
              price: 250,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite showcasing Lalitpur's rich cultural heritage, with interactive exhibits, traditional craft displays, and personalized cultural experiences.",
            },
            {
              type: "Rooftop Dining Experience Room",
              price: 180,
              capacity: "2 Adults",
              available: 4,
              description:
                "Unique room with exclusive access to the hotel's rooftop restaurant, offering gourmet dining and breathtaking views of Lalitpur's historic landscape.",
            },
          ],
        },
        {
          id: "lal2",
          name: "The Inn Patan",
          price: 95,
          rating: 4.7,
          location: "Mangal Bazaar, Lalitpur",
          amenities: [
            "Heritage Building",
            "Garden",
            "Restaurant",
            "Cultural Experience",
          ],
          servicesOffered: [
            "Cultural Experiences",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
            "Garden Access",
          ],
          image: ["/images/li2.jpg"],
          coords: [27.6762, 85.3245],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li2.jpg"],
          description:
            "Stay in a beautifully restored heritage building that offers a glimpse into the rich culture of Lalitpur.",
          rooms: [
            {
              type: "Artisan's Garden Retreat",
              price: 140,
              capacity: "2 Adults",
              available: 6,
              description:
                "Serene room overlooking the hotel's traditional garden, featuring local craft displays and direct access to artisan workshops.",
            },
            {
              type: "Heritage Living Suite",
              price: 280,
              capacity: "3 Adults",
              available: 4,
              description:
                "Comprehensive suite replicating a traditional Newari home, with authentic furnishings, cultural artifacts, and immersive historical experiences.",
            },
            {
              type: "Mangal Bazaar View Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Vibrant room offering stunning views of Mangal Bazaar, capturing the essence of Lalitpur's bustling local life and cultural heritage.",
            },
          ],
        },
        {
          id: "lal3",
          name: "Hotel Himalaya",
          price: 130,
          rating: 4.4,
          location: "Kupondole, Lalitpur",
          amenities: [
            "Swimming Pool",
            "Multiple Restaurants",
            "Conference Rooms",
            "Spa",
          ],
          servicesOffered: [
            "Swimming Pool",
            "Spa Services",
            "Business Center",
            "Room Service",
            "Free Wi-Fi",
          ],
          image: ["/images/li3.jpg"],
          coords: [27.6805, 85.3162],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li3.jpg"],
          description:
            "This hotel features a swimming pool and multiple dining options, perfect for both relaxation and business.",
          rooms: [
            {
              type: "Wellness Sanctuary Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Tranquil room with direct access to the hotel's spa, featuring holistic wellness amenities and relaxation-focused design.",
            },
            {
              type: "Business Executive Suite",
              price: 300,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite designed for business professionals, with integrated work spaces, conference facilities, and premium connectivity.",
            },
            {
              type: "Poolside Relaxation Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Refreshing room with direct views of the swimming pool, offering a perfect blend of leisure and comfort.",
            },
          ],
        },
        {
          id: "lal4",
          name: "Greenwich Village Hotel",
          price: 85,
          rating: 4.3,
          location: "Jhamsikhel, Lalitpur",
          amenities: ["Restaurant", "Bar", "Garden", "Free Wi-Fi"],
          servicesOffered: [
            "Garden Access",
            "Free Breakfast",
            "Room Service",
            "Local Tours",
            "Cultural Activities",
          ],
          image: ["/images/li4.jpg"],
          coords: [27.6789, 85.3169],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li4.jpg"],
          description:
            "Enjoy a cozy atmosphere with a garden and bar, ideal for unwinding after a day of exploring.",
          rooms: [
            {
              type: "Garden Serenity Room",
              price: 130,
              capacity: "2 Adults",
              available: 6,
              description:
                "Peaceful room overlooking the hotel's lush garden, designed for relaxation and tranquility.",
            },
            {
              type: "Urban Socialite Suite",
              price: 250,
              capacity: "3 Adults",
              available: 4,
              description:
                "Vibrant suite perfect for social gatherings, featuring a private bar area and contemporary urban design.",
            },
            {
              type: "Culinary Explorer's Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Unique room near the hotel's restaurant, offering culinary experiences and local food culture insights.",
            },
          ],
        },
        {
          id: "lal5",
          name: "Hotel Goodday",
          price: 70,
          rating: 4.2,
          location: "Pulchowk, Lalitpur",
          amenities: [
            "Free Breakfast",
            "Business Center",
            "Restaurant",
            "Laundry",
          ],
          servicesOffered: [
            "Free Breakfast",
            "Business Services",
            "Room Service",
            "Laundry Service",
            "Local Tours",
          ],
          image: ["/images/li5.jpg"],
          coords: [27.6775, 85.3198],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li5.jpg"],
          description:
            "This budget-friendly hotel offers comfortable accommodations with complimentary breakfast and business services.",
          rooms: [
            {
              type: "Business Traveler's Compact Room",
              price: 100,
              capacity: "2 Adults",
              available: 7,
              description:
                "Efficient room designed for business travelers, with ergonomic workspace and essential connectivity features.",
            },
            {
              type: "Family Comfort Suite",
              price: 200,
              capacity: "4 Adults",
              available: 3,
              description:
                "Spacious suite offering family-friendly amenities, interconnected spaces, and convenient services.",
            },
            {
              type: "Budget-Friendly City View Room",
              price: 120,
              capacity: "2 Adults",
              available: 5,
              description:
                "Affordable room with city views, offering comfort and essential amenities for budget-conscious travelers.",
            },
          ],
        },
        {
          id: "lal6",
          name: "Hotel Patan Square",
          price: 90,
          rating: 4.5,
          location: "Patan Durbar Square Area",
          amenities: [
            "Heritage Views",
            "Rooftop Cafe",
            "Cultural Tours",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Rooftop Cafe",
            "Cultural Tours",
            "Free Wi-Fi",
            "Room Service",
            "Local Experiences",
          ],
          image: ["/images/li6.jpg"],
          coords: [27.6768, 85.3243],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li6.jpg"],
          description:
            "This hotel offers cultural tours and a rooftop cafe with stunning views of Patan Durbar Square.",
          rooms: [
            {
              type: "Patan Durbar Square Heritage Room",
              price: 150,
              capacity: "2 Adults",
              available: 5,
              description:
                "Elegantly designed room offering panoramic views of Patan Durbar Square, featuring traditional Newari architectural elements and curated local artwork.",
            },
            {
              type: "Rooftop Cultural Experience Suite",
              price: 280,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite with exclusive rooftop cafe access, offering immersive cultural experiences, live music sessions, and breathtaking views of Lalitpur's historic landscape.",
            },
            {
              type: "Artisan's Inspiration Room",
              price: 180,
              capacity: "2 Adults",
              available: 4,
              description:
                "Creative room designed to connect guests with local crafts, featuring a dedicated workspace, local art displays, and views of traditional artisan workshops.",
            },
          ],
        },
        {
          id: "lal7",
          name: "Maya Boutique Hotel",
          price: 115,
          rating: 4.6,
          location: "Sanepa, Lalitpur",
          amenities: ["Boutique Design", "Restaurant", "Bar", "Garden"],
          servicesOffered: [
            "Boutique Shopping",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
            "Cultural Activities",
          ],
          image: ["/images/li7.jpg"],
          coords: [27.6812, 85.3156],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/li7.jpg"],
          description:
            "Experience boutique luxury in this stylish hotel with a beautiful garden and excellent dining options.",
          rooms: [
            {
              type: "Garden Serenity Boutique Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Tranquil room overlooking the hotel's meticulously designed garden, featuring boutique design elements and natural, calming aesthetics.",
            },
            {
              type: "Urban Luxury Lifestyle Suite",
              price: 300,
              capacity: "3 Adults",
              available: 3,
              description:
                "Comprehensive suite embodying contemporary urban design, with a private bar area, curated art pieces, and personalized boutique shopping experiences.",
            },
            {
              type: "Culinary Design Experience Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Unique room near the hotel's restaurant, offering gourmet dining insights, cooking masterclasses, and a fusion of culinary and design experiences.",
            },
          ],
        },
      ],
    },
  
    lumbini: {
      name: "Lumbini",
      referencePoint: { lat: 27.4833, lon: 83.2767 },
      centerName: "Maya Devi Temple",
      hotels: [
        {
          id: "lum1",
          name: "Buddha Maya Garden Hotel",
          price: 120,
          rating: 4.7,
          location: "Maya Devi Temple Road",
          amenities: [
            "Temple View",
            "Meditation Center",
            "Garden",
            "Free Breakfast",
            "Spa",
          ],
          servicesOffered: [
            "Meditation Classes",
            "Temple Tours",
            "Free Wi-Fi",
            "Room Service",
            "Spa Services",
          ],
          image: ["/images/l1.jpg"],
          coords: [27.4833, 83.2767],
          reviews: generateRandomReviews(),
          detailsImage: [
            "/images/l1.jpg",
            "/images/l2.jpg",
            "/images/l3.jpg",
            "/images/l4.jpg",
          ],
          description:
            "This hotel offers a peaceful retreat with a meditation center and beautiful views of the Maya Devi Temple.",
          rooms: [
            {
              type: "Spiritual Serenity Room",
              price: 150,
              capacity: "2 Adults",
              available: 5,
              description:
                "Tranquil room designed for mindfulness, featuring meditation corner, Buddhist art, and direct views of the meditation garden.",
            },
            {
              type: "Temple View Wellness Suite",
              price: 280,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive wellness suite with panoramic Maya Devi Temple views, private yoga space, and holistic healing amenities.",
            },
            {
              type: "Enlightenment Retreat Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Contemplative room offering spiritual resources, sacred texts, and a peaceful environment for personal reflection.",
            },
          ],
        },
        {
          id: "lum2",
          name: "Hotel Ananda Inn",
          price: 90,
          rating: 4.5,
          location: "Lumbini Cultural Municipality",
          amenities: [
            "Temple Tours",
            "Restaurant",
            "Meditation Room",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Temple Tours",
            "Free Breakfast",
            "Room Service",
            "Cultural Activities",
            "Local Tours",
          ],
          image: ["/images/l2.jpg"],
          coords: [27.4835, 83.2769],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l2.jpg"],
          description:
            "Enjoy comfortable accommodations with easy access to temple tours and cultural experiences.",
          rooms: [
            {
              type: "Cultural Immersion Room",
              price: 140,
              capacity: "2 Adults",
              available: 6,
              description:
                "Room designed to connect guests with Lumbini's rich spiritual heritage, featuring local art and cultural artifacts.",
            },
            {
              type: "Pilgrimage Experience Suite",
              price: 250,
              capacity: "4 Adults",
              available: 4,
              description:
                "Expansive suite offering comprehensive spiritual journey resources, including guided meditation and cultural workshop spaces.",
            },
            {
              type: "Peaceful Traveler's Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Thoughtfully designed room for mindful travelers, with calming decor and resources for personal spiritual exploration.",
            },
          ],
        },
        {
          id: "lum3",
          name: "Lumbini Garden New Crystal Hotel",
          price: 110,
          rating: 4.6,
          location: "Near Japanese Peace Stupa",
          amenities: [
            "Garden View",
            "Conference Hall",
            "Restaurant",
            "Tour Desk",
          ],
          servicesOffered: [
            "Conference Facilities",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
            "Garden Access",
          ],
          image: ["/images/l3.jpg"],
          coords: [27.484, 83.2772],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l3.jpg"],
          description:
            "This hotel features a beautiful garden view and is perfect for both leisure and business travelers.",
          rooms: [
            {
              type: "Zen Garden Retreat Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Serene room overlooking the Japanese-inspired garden, featuring minimalist design and peaceful meditation spaces.",
            },
            {
              type: "Business and Wellness Suite",
              price: 300,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite balancing professional needs with spiritual wellness, including a dedicated workspace and meditation area.",
            },
            {
              type: "Cultural Harmony Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Room celebrating international peace and cultural understanding, with art installations and resources for cross-cultural learning.",
            },
          ],
        },
        {
          id: "lum4",
          name: "Hotel Peace Palace",
          price: 85,
          rating: 4.4,
          location: "Peace Road, Lumbini",
          amenities: [
            "Meditation Hall",
            "Vegetarian Restaurant",
            "Garden",
            "Free Parking",
          ],
          servicesOffered: [
            "Meditation Classes",
            "Vegetarian Meals",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
          ],
          image: ["/images/l4.jpg"],
          coords: [27.4838, 83.2765],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l4.jpg"],
          description:
            "A tranquil hotel with a meditation hall and vegetarian restaurant, ideal for a peaceful stay.",
          rooms: [
            {
              type: "Mindfulness Sanctuary Room",
              price: 130,
              capacity: "2 Adults",
              available: 6,
              description:
                "Dedicated space for inner peace, featuring meditation cushions, calming decor, and mindfulness resources.",
            },
            {
              type: "Vegetarian Wellness Suite",
              price: 250,
              capacity: "4 Adults",
              available: 4,
              description:
                "Holistic suite offering vegetarian culinary experiences, nutrition workshops, and comprehensive wellness amenities.",
            },
            {
              type: "Inner Peace Retreat Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Tranquil room designed for personal reflection, with spiritual literature, meditation aids, and peaceful ambiance.",
            },
          ],
        },
        {
          id: "lum5",
          name: "Lumbini Hokke Hotel",
          price: 130,
          rating: 4.8,
          location: "Near Mayadevi Temple",
          amenities: ["Japanese Restaurant", "Spa", "Garden", "Temple View"],
          servicesOffered: [
            "Japanese Dining",
            "Spa Services",
            "Free Wi-Fi",
            "Room Service",
            "Temple Tours",
          ],
          image: ["/images/l5.jpg"],
          coords: [27.4832, 83.2768],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l5.jpg"],
          description:
            "This hotel offers a unique Japanese dining experience and is located near the sacred Mayadevi Temple.",
          rooms: [
            {
              type: "Zen Meditation Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Japanese-inspired room blending spiritual tranquility with minimalist design, featuring zen garden views and meditation resources.",
            },
            {
              type: "Culinary Spiritual Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite offering Japanese culinary experiences, spa treatments, and immersive spiritual wellness programs.",
            },
            {
              type: "Temple Harmony Room",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Room celebrating the spiritual connection between Japanese and Buddhist traditions, with cultural artifacts and peaceful design.",
            },
          ],
        },
        {
          id: "lum6",
          name: "Hotel Nirvana",
          price: 95,
          rating: 4.5,
          location: "Buddha Path, Lumbini",
          amenities: [
            "Meditation Center",
            "Yoga Classes",
            "Vegetarian Restaurant",
            "Garden",
          ],
          servicesOffered: [
            "Yoga Classes",
            "Meditation Sessions",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
          ],
          image: ["/images/l6.jpg"],
          coords: [27.4836, 83.2771],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l6.jpg"],
          description:
            "A serene hotel offering yoga classes and a meditation center, perfect for spiritual travelers.",
          rooms: [
            {
              type: "Yoga Wellness Room",
              price: 150,
              capacity: "2 Adults",
              available: 6,
              description:
                "Dedicated space for yoga and personal wellness, featuring premium yoga equipment and holistic healing resources.",
            },
            {
              type: "Spiritual Transformation Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite offering intensive wellness programs, private yoga sessions, and transformative spiritual experiences.",
            },
            {
              type: "Mindful Living Room",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Room designed for holistic personal growth, with meditation tools, inspirational literature, and peaceful ambiance.",
            },
          ],
        },
        {
          id: "lum7",
          name: "Zen International Hotel",
          price: 115,
          rating: 4.6,
          location: "International Zone, Lumbini",
          amenities: [
            "International Restaurant",
            "Business Center",
            "Spa",
            "Temple Tours",
          ],
          servicesOffered: [
            "International Cuisine",
            "Business Services",
            "Spa Services",
            "Room Service",
            "Temple Tours",
          ],
          image: ["/images/l7.jpg"],
          coords: [27.4834, 83.2773],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/l7.jpg"],
          description:
            "This international hotel combines luxury with cultural experiences, offering temple tours and a spa.",
          rooms: [
            {
              type: "International Spiritual Retreat Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Globally inspired room blending international design with Lumbini's spiritual essence, featuring multicultural meditation resources.",
            },
            {
              type: "Luxury Pilgrimage Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite offering a luxurious spiritual journey experience, with international wellness amenities and personalized cultural guidance.",
            },
            {
              type: "Mindful Business Traveler's Room",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Unique room designed for professionals seeking balance, with integrated workspace and spiritual wellness resources.",
            },
          ],
        },
      ],
    },
  
    janakpur: {
      name: "Janakpur",
      referencePoint: { lat: 26.7277, lon: 85.9405 },
      centerName: "Janaki Temple",
      hotels: [
        {
          id: "jan1",
          name: "Hotel Sita Palace",
          price: 100,
          rating: 4.6,
          location: "Near Janaki Temple",
          amenities: [
            "Temple View",
            "Cultural Restaurant",
            "Free Wi-Fi",
            "Heritage Tours",
          ],
          servicesOffered: [
            "Cultural Experiences",
            "Temple Tours",
            "Free Wi-Fi",
            "Room Service",
            "Local Guides",
          ],
          image: ["/images/j1.jpg"],
          coords: [26.7276, 85.9403],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j1.jpg"],
          description:
            "Experience the rich cultural heritage of Janakpur with a stay near the iconic Janaki Temple.",
          rooms: [
            {
              type: "Ramayana Heritage Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Immersive room showcasing the epic Ramayana through artistic displays, traditional decor, and cultural artifacts.",
            },
            {
              type: "Royal Mythological Suite",
              price: 300,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite celebrating the royal legacy of Janakpur, featuring comprehensive storytelling resources and mythological art installations.",
            },
            {
              type: "Cultural Storyteller's Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated space for cultural enthusiasts, offering interactive storytelling sessions, local literature, and mythological research resources.",
            },
          ],
        },
        {
          id: "jan2",
          name: "Janaki Temple View Hotel",
          price: 90,
          rating: 4.5,
          location: "Temple Complex Area",
          amenities: [
            "Temple Proximity",
            "Restaurant",
            "Cultural Programs",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Cultural Experiences",
            "Temple Tours",
            "Free Breakfast",
            "Room Service",
            "Local Performances",
          ],
          image: ["/images/j2.jpg"],
          coords: [26.7278, 85.9406],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j2.jpg"],
          description:
            "Enjoy unparalleled proximity to the Janaki Temple with cultural immersion and local experiences.",
          rooms: [
            {
              type: "Temple Panorama Room",
              price: 150,
              capacity: "2 Adults",
              available: 6,
              description:
                "Room offering breathtaking views of the Janaki Temple, with a private balcony and cultural interpretation resources.",
            },
            {
              type: "Spiritual Journey Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite designed for spiritual seekers, featuring meditation spaces, religious literature, and guided cultural experiences.",
            },
            {
              type: "Local Artisan's Retreat",
              price: 190,
              capacity: "2 Adults",
              available: 5,
              description:
                "Creative room connecting guests with local crafts, featuring workspace, traditional art displays, and artisan workshop insights.",
            },
          ],
        },
        {
          id: "jan3",
          name: "Ram Janaki Heritage Hotel",
          price: 110,
          rating: 4.7,
          location: "Cultural District",
          amenities: [
            "Cultural Experience",
            "Restaurant",
            "Heritage Tours",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Cultural Workshops",
            "Heritage Tours",
            "Free Wi-Fi",
            "Room Service",
            "Local Experiences",
          ],
          image: ["/images/j3.jpg"],
          coords: [26.7275, 85.9404],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j3.jpg"],
          description:
            "Enjoy a comfortable stay with easy access to the Janaki Temple and local markets.",
          rooms: [
            {
              type: "Mythological Heritage Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Elegantly designed room showcasing the epic Ramayana through curated artifacts, traditional artwork, and historical narratives.",
            },
            {
              type: "Cultural Immersion Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite offering deep cultural experiences, including traditional craft workshops, storytelling sessions, and local art exhibitions.",
            },
            {
              type: "Artisan's Cultural Room",
              price: 210,
              capacity: "2 Adults",
              available: 4,
              description:
                "Creative space designed to connect guests with local craftsmanship, featuring interactive art displays and traditional skill demonstrations.",
            },
          ],
        },
        {
          id: "jan4",
          name: "Hotel Shree Ram",
          price: 70,
          rating: 4.0,
          location: "Janakpur",
          amenities: [
            "Free Wi-Fi",
            "Restaurant",
            "Air Conditioning",
            "Laundry Service",
          ],
          servicesOffered: [
            "Free Wi-Fi",
            "Room Service",
            "Cultural Activities",
            "Local Tours",
          ],
          image: ["/images/j4.jpg"],
          coords: [26.7277, 85.941],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j4.jpg", "/images/j6.jpg"],
          description:
            "This budget-friendly hotel offers comfortable accommodations and easy access to local attractions.",
          rooms: [
            {
              type: "Budget Cultural Explorer Room",
              price: 120,
              capacity: "2 Adults",
              available: 6,
              description:
                "Affordable room designed for budget travelers, offering local cultural insights and essential comfort amenities.",
            },
            {
              type: "Family Cultural Experience Suite",
              price: 250,
              capacity: "4 Adults",
              available: 4,
              description:
                "Spacious suite providing family-friendly cultural experiences, with interconnected spaces and local storytelling resources.",
            },
            {
              type: "Local Traveler's Compact Room",
              price: 100,
              capacity: "2 Adults",
              available: 5,
              description:
                "Efficient room for solo travelers and backpackers, offering essential amenities and local cultural connections.",
            },
          ],
        },
        {
          id: "jan5",
          name: "Hotel Ramayana",
          price: 85,
          rating: 4.4,
          location: "Janakpur",
          amenities: ["Free Wi-Fi", "Restaurant", "Air Conditioning", "Garden"],
          servicesOffered: [
            "Free Breakfast",
            "Room Service",
            "Cultural Tours",
            "Garden Access",
            "Local Experiences",
          ],
          image: ["/images/j5.jpg"],
          coords: [26.7279, 85.9411],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j5.jpg"],
          description:
            "Experience the local culture and hospitality in this charming hotel near Janaki Temple.",
          rooms: [
            {
              type: "Garden Cultural Retreat Room",
              price: 140,
              capacity: "2 Adults",
              available: 5,
              description:
                "Serene room overlooking the hotel's garden, offering a peaceful space for cultural reflection and local experiences.",
            },
            {
              type: "Mythological Wellness Suite",
              price: 280,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite blending cultural experiences with wellness, featuring meditation spaces and holistic cultural resources.",
            },
            {
              type: "Local Hospitality Room",
              price: 180,
              capacity: "2 Adults",
              available: 4,
              description:
                "Intimate room designed to showcase local hospitality, with traditional decor and personalized cultural interaction opportunities.",
            },
          ],
        },
        {
          id: "jan6",
          name: "Hotel Divine",
          price: 95,
          rating: 4.5,
          location: "Janakpur",
          amenities: ["Luxury Rooms", "Restaurant", "Free Wi-Fi", "Spa"],
          servicesOffered: [
            "Spa Services",
            "Room Service",
            "Free Breakfast",
            "Cultural Tours",
            "Local Tours",
          ],
          image: ["/images/j6.jpg"],
          coords: [26.728, 85.9405],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j6.jpg", "/images/j7.jpg"],
          description:
            "A luxurious hotel offering spa services and cultural experiences in the heart of Janakpur.",
          rooms: [
            {
              type: "Spiritual Luxury Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Elegantly designed room combining luxury with spiritual ambiance, featuring premium wellness amenities and cultural touches.",
            },
            {
              type: "Royal Wellness Sanctuary Suite",
              price: 350,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite offering comprehensive wellness experiences, with private spa facilities and personalized cultural healing programs.",
            },
            {
              type: "Holistic Healing Room",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated room for holistic wellness, featuring meditation resources, spa treatments, and spiritual guidance.",
            },
          ],
        },
        {
          id: "jan7",
          name: "Mithila Cultural Resort",
          price: 105,
          rating: 4.6,
          location: "Janakpur Cultural Zone",
          amenities: [
            "Cultural Museum",
            "Traditional Restaurant",
            "Art Gallery",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Cultural Workshops",
            "Art Exhibitions",
            "Traditional Dining",
            "Room Service",
            "Local Craft Experiences",
          ],
          image: ["/images/j7.jpg"],
          coords: [26.7281, 85.9407],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/j7.jpg"],
          description:
            "A unique resort celebrating the rich Mithila culture, offering immersive artistic and cultural experiences.",
          rooms: [
            {
              type: "Mithila Art Heritage Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Room dedicated to Mithila art, featuring hand-painted walls, traditional artwork, and interactive cultural displays.",
            },
            {
              type: "Cultural Immersion Masterclass Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite offering deep cultural experiences, including traditional art workshops, craft demonstrations, and curated Mithila cultural resources.",
            },
            {
              type: "Artisan's Creative Sanctuary",
              price: 210,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated creative space for artists and culture enthusiasts, with professional-grade art supplies, local craft tools, and inspirational cultural environment.",
            },
          ],
        },
      ],
    },
  
    nagarkot: {
      name: "Nagarkot",
      referencePoint: { lat: 27.7172, lon: 85.5197 },
      centerName: "Sunrise View Point",
      hotels: [
        {
          id: "nag1",
          name: "Himalayan View Resort",
          price: 130,
          rating: 4.6,
          location: "Nagarkot Sunrise Point",
          amenities: [
            "Panoramic Mountain Views",
            "Restaurant",
            "Sunrise Deck",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Sunrise Photography Tours",
            "Mountain Trekking",
            "Free Wi-Fi",
            "Room Service",
            "Local Experiences",
          ],
          image: ["/images/n1.jpg"],
          coords: [27.7175, 85.52],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n1.jpg", "/images/n2.jpg", "/images/n3.jpg"],
          description:
            "Experience breathtaking Himalayan views and unforgettable sunrise moments in this mountain retreat.",
          rooms: [
            {
              type: "Himalayan Sunrise Observation Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Strategically designed room with floor-to-ceiling windows offering uninterrupted panoramic mountain and sunrise views.",
            },
            {
              type: "Mountain Meditation Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive wellness suite with private meditation space, mountain view yoga deck, and holistic healing resources.",
            },
            {
              type: "Photography Explorer's Room",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Specialized room for photographers and nature enthusiasts, featuring professional-grade camera equipment and editing workspace.",
            },
          ],
        },
        {
          id: "nag2",
          name: "Mountain Breeze Hotel",
          price: 100,
          rating: 4.5,
          location: "Nagarkot Village",
          amenities: ["Mountain Views", "Garden", "Restaurant", "Free Wi-Fi"],
          servicesOffered: [
            "Trekking Arrangements",
            "Local Tours",
            "Free Wi-Fi",
            "Room Service",
            "Cultural Experiences",
          ],
          image: ["/images/n2.jpg"],
          coords: [27.717, 85.5195],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n2.jpg"],
          description:
            "A cozy hotel offering warm hospitality and stunning mountain landscapes.",
          rooms: [
            {
              type: "Mountain Serenity Room",
              price: 150,
              capacity: "2 Adults",
              available: 6,
              description:
                "Tranquil room designed to connect guests with nature, featuring local artwork and direct mountain view balcony.",
            },
            {
              type: "Trekkers' Comfort Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite for adventure enthusiasts, with gear storage, recovery area, and mountain trail information center.",
            },
            {
              type: "Cultural Mountain Retreat",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Immersive room showcasing local mountain culture, with traditional decor and cultural interaction resources.",
            },
          ],
        },
        {
          id: "nag3",
          name: "Sunrise Peak Hotel",
          price: 115,
          rating: 4.7,
          location: "Nagarkot Viewpoint",
          amenities: [
            "Sunrise Deck",
            "Panoramic Views",
            "Restaurant",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Sunrise Photography",
            "Mountain Tours",
            "Free Wi-Fi",
            "Room Service",
            "Local Experiences",
          ],
          image: ["/images/n3.jpg"],
          coords: [27.7173, 85.5198],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n3.jpg"],
          description:
            "The ultimate destination for sunrise lovers and mountain enthusiasts.",
          rooms: [
            {
              type: "Sunrise Observation Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Perfectly positioned room with advanced sunrise viewing technology and professional photography equipment.",
            },
            {
              type: "Himalayan Explorer's Suite",
              price: 350,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive adventure suite with mountain research resources, trekking planning area, and immersive landscape experiences.",
            },
            {
              type: "Mountain Wellness Retreat",
              price: 240,
              capacity: "2 Adults",
              available: 4,
              description:
                "Holistic room focusing on mountain-inspired wellness, featuring meditation spaces and natural healing resources.",
            },
          ],
        },
        {
          id: "nag4",
          name: "Cloud Valley Resort",
          price: 125,
          rating: 4.6,
          location: "Nagarkot Forest Edge",
          amenities: ["Forest Views", "Spa", "Restaurant", "Nature Trails"],
          servicesOffered: [
            "Nature Walks",
            "Spa Services",
            "Free Wi-Fi",
            "Room Service",
            "Forest Experiences",
          ],
          image: ["/images/n4.jpg"],
          coords: [27.7168, 85.5196],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n4.jpg"],
          description:
            "A serene resort nestled at the forest's edge, offering tranquility and natural beauty.",
          rooms: [
            {
              type: "Forest Harmony Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Eco-designed room blending seamlessly with forest surroundings, featuring sustainable materials and nature-inspired decor.",
            },
            {
              type: "Wellness Forest Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive wellness suite offering forest therapy, meditation spaces, and holistic healing experiences.",
            },
            {
              type: "Nature Explorer's Retreat",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Specialized room for nature enthusiasts, with research resources, wildlife observation tools, and forest conservation information.",
            },
          ],
        },
        {
          id: "nag5",
          name: "Himalayan Eco Lodge",
          price: 95,
          rating: 4.4,
          location: "Nagarkot Eco Zone",
          amenities: [
            "Sustainable Design",
            "Organic Restaurant",
            "Nature Trails",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Eco Tours",
            "Sustainable Practices",
            "Free Wi-Fi",
            "Room Service",
            "Conservation Programs",
          ],
          image: ["/images/n5.jpg"],
          coords: [27.7171, 85.5199],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n5.jpg"],
          description:
            "An eco-friendly lodge committed to sustainable tourism and environmental conservation.",
          rooms: [
            {
              type: "Sustainable Living Room",
              price: 140,
              capacity: "2 Adults",
              available: 6,
              description:
                "Innovative room showcasing sustainable living practices, with renewable energy demonstrations and eco-education resources.",
            },
            {
              type: "Conservation Research Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite for environmental researchers and conservation enthusiasts, with study spaces and ecological resources.",
            },
            {
              type: "Green Traveler's Retreat",
              price: 190,
              capacity: "2 Adults",
              available: 5,
              description:
                "Eco-conscious room designed for environmentally aware travelers, featuring sustainable amenities and conservation insights.",
            },
          ],
        },
        {
          id: "nag6",
          name: "Mountain Horizon Hotel",
          price: 110,
          rating: 4.5,
          location: "Nagarkot Viewpoint",
          amenities: [
            "Panoramic Views",
            "Restaurant",
            "Adventure Desk",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Mountain Tours",
            "Adventure Sports",
            "Free Wi-Fi",
            "Room Service",
            "Local Experiences",
          ],
          image: ["/images/n6.jpg"],
          coords: [27.7174, 85.5201],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n6.jpg"],
          description:
            "Experience adventure and breathtaking mountain views in this dynamic mountain hotel.",
          rooms: [
            {
              type: "Adventure Base Camp Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Specialized room for adventure enthusiasts, with gear storage, trail maps, and mountain activity planning resources.",
            },
            {
              type: "Extreme Sports Wellness Suite",
              price: 350,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite for extreme sports lovers, featuring recovery facilities, equipment maintenance area, and performance tracking resources.",
            },
            {
              type: "Mountain Expedition Retreat",
              price: 240,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated room for mountain expedition preparation, with professional planning resources and immersive mountain experience tools.",
            },
          ],
        },
        {
          id: "nag7",
          name: "Hotel Himalayan Villa",
          price: 140,
          rating: 4.7,
          location: "Nagarkot Sunrise Point",
          amenities: [
            "Premium Views",
            "Heated Rooms",
            "Bar",
            "Adventure Sports Desk",
          ],
          servicesOffered: [
            "Adventure Sports Arrangements",
            "Room Service",
            "Free Wi-Fi",
            "Local Tours",
          ],
          image: ["/images/n7.jpg"],
          coords: [27.7171, 85.5237],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/n7.jpg"],
          description:
            "This villa offers premium views and is an ideal spot for adventure sports enthusiasts.",
          rooms: [
            {
              type: "Luxury Mountain Panorama Room",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Premium room offering unparalleled mountain views, with heated floors and advanced comfort technologies.",
            },
            {
              type: "Adventure Elite Suite",
              price: 400,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite for premium adventure experiences, featuring personal gear preparation area and high-end wellness facilities.",
            },
            {
              type: "Mountain Luxury Retreat",
              price: 280,
              capacity: "2 Adults",
              available: 4,
              description:
                "Exclusive room designed for discerning travelers, offering personalized mountain experiences and premium comfort amenities.",
            },
          ],
        },
      ],
    },
  
    dharan: {
      name: "Dharan",
      referencePoint: { lat: 26.8065, lon: 87.2846 },
      centerName: "Dharan Clock Tower",
      hotels: [
        {
          id: "dhr1",
          name: "Hotel Sungava",
          price: 85,
          rating: 4.2,
          location: "Putali Line, Dharan",
          amenities: ["Restaurant", "Free Wi-Fi", "City View", "Conference Room"],
          servicesOffered: [
            "Free Breakfast",
            "Room Service",
            "Conference Facilities",
            "Local Tours",
          ],
          image: ["/images/d1.jpg"],
          coords: [26.8065, 87.2846],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d1.jpg"],
          description:
            "This hotel offers comfortable accommodations with city views and modern amenities.",
          rooms: [
            {
              type: "Urban Panorama Room",
              price: 150,
              capacity: "2 Adults",
              available: 5,
              description:
                "Spacious room offering expansive city views, featuring contemporary design and local urban art installations.",
            },
            {
              type: "Business Connectivity Suite",
              price: 250,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite designed for professional travelers, with integrated workspace, conference facilities, and city landscape views.",
            },
            {
              type: "Local Culture Insight Room",
              price: 180,
              capacity: "2 Adults",
              available: 4,
              description:
                "Room celebrating Dharan's cultural diversity, featuring local artworks, cultural resources, and interactive city experience displays.",
            },
          ],
        },
        {
          id: "dhr2",
          name: "Hotel Xenial",
          price: 95,
          rating: 4.4,
          location: "Dharan Market",
          amenities: ["Business Center", "Restaurant", "Gym", "Free Parking"],
          servicesOffered: [
            "Business Services",
            "Free Wi-Fi",
            "Room Service",
            "Local Tours",
          ],
          image: ["/images/d2.jpg"],
          coords: [26.8068, 87.2849],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d2.jpg"],
          description:
            "Ideal for business travelers, this hotel features a gym and business center for your convenience.",
          rooms: [
            {
              type: "Professional Performance Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Ergonomically designed room for business professionals, featuring advanced connectivity and productivity-enhancing amenities.",
            },
            {
              type: "Wellness Business Suite",
              price: 300,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite blending business functionality with wellness, including private gym access and holistic work-life balance resources.",
            },
            {
              type: "Market Pulse Traveler's Room",
              price: 200,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dynamic room offering insights into Dharan's market culture, with local business resources and networking spaces.",
            },
          ],
        },
        {
          id: "dhr3",
          name: "Hotel Gajur",
          price: 110,
          rating: 4.6,
          location: "Bijaypur Hill, Dharan",
          amenities: ["Hill View", "Restaurant", "Bar", "Adventure Sports Desk"],
          servicesOffered: [
            "Adventure Sports Arrangements",
            "Room Service",
            "Free Wi-Fi",
            "Local Tours",
          ],
          image: ["/images/d3.jpg"],
          coords: [26.807, 87.2852],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d3.jpg"],
          description:
            "Enjoy hill views and adventure sports arrangements at this comfortable hotel.",
          rooms: [
            {
              type: "Hill Adventure Base Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Specialized room for adventure enthusiasts, featuring gear storage, trail maps, and local adventure planning resources.",
            },
            {
              type: "Extreme Sports Wellness Suite",
              price: 350,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite for adventure lovers, with recovery facilities, equipment maintenance area, and performance tracking resources.",
            },
            {
              type: "Nature Explorer's Retreat",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated room for nature and adventure enthusiasts, offering immersive local landscape experiences and outdoor activity insights.",
            },
          ],
        },
        {
          id: "dhr4",
          name: "Hotel Ambassaddor",
          price: 80,
          rating: 4.3,
          location: "Near BP Koirala Institute",
          amenities: [
            "Medical Tourism Support",
            "Restaurant",
            "Free Wi-Fi",
            "Shuttle Service",
          ],
          servicesOffered: [
            "Medical Tourism Support",
            "Room Service",
            "Free Wi-Fi",
            "Local Tours",
          ],
          image: ["/images/d4.jpg"],
          coords: [26.8063, 87.2844],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d4.jpg"],
          description:
            "This hotel offers medical tourism support and comfortable accommodations for patients and families.",
          rooms: [
            {
              type: "Medical Care Comfort Room",
              price: 140,
              capacity: "2 Adults",
              available: 6,
              description:
                "Thoughtfully designed room for medical travelers, offering comfort, privacy, and support resources for patients and families.",
            },
            {
              type: "Healing and Recovery Suite",
              price: 280,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite providing holistic healing environment, with medical support facilities and wellness recovery resources.",
            },
            {
              type: "Patient Care Companion Room",
              price: 180,
              capacity: "2 Adults",
              available: 5,
              description:
                "Supportive room designed for medical caregivers, featuring rest areas, medical information resources, and comfort amenities.",
            },
          ],
        },
        {
          id: "dhr5",
          name: "Hotel Aangan",
          price: 120,
          rating: 4.7,
          location: "Aangan, Dharan",
          amenities: [
            "Premium Rooms",
            "Swimming Pool",
            "Multi-cuisine Restaurant",
            "Spa",
          ],
          servicesOffered: [
            "Spa Services",
            "Room Service",
            "Free Wi-Fi",
            "Local Tours",
          ],
          image: ["/images/d5.jpg"],
          coords: [26.8072, 87.2855],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d5.jpg"],
          description:
            "This premium hotel features a swimming pool and multi-cuisine restaurant for a luxurious stay.",
          rooms: [
            {
              type: "Luxury Wellness Retreat Room",
              price: 200,
              capacity: "2 Adults",
              available: 5,
              description:
                "Premium room offering comprehensive wellness experiences, with spa access and personalized relaxation amenities.",
            },
            {
              type: "Culinary and Spa Experience Suite",
              price: 400,
              capacity: "4 Adults",
              available: 3,
              description:
                "Expansive suite blending gourmet dining and spa experiences, with private dining and wellness treatment areas.",
            },
            {
              type: "Lifestyle Luxury Room",
              price: 250,
              capacity: "2 Adults",
              available: 4,
              description:
                "Elegantly designed room showcasing premium lifestyle experiences, with curated amenities and personalized service.",
            },
          ],
        },
        {
          id: "dhr6",
          name: "Hotel City Plaza",
          price: 75,
          rating: 4.2,
          location: "Putali Line Market",
          amenities: [
            "Central Location",
            "Restaurant",
            "Business Center",
            "Free Wi-Fi",
          ],
          servicesOffered: [
            "Free Breakfast",
            "Room Service",
            "Business Services",
            "Local Tours",
          ],
          image: ["/images/d6.jpg"],
          coords: [26.8066, 87.2847],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d6.jpg"],
          description:
            "Centrally located, this hotel offers easy access to local attractions and comfortable accommodations.",
          rooms: [
            {
              type: "Urban Explorer's Compact Room",
              price: 130,
              capacity: "2 Adults",
              available: 6,
              description:
                "Efficiently designed room for city travelers, offering essential amenities and local city exploration resources.",
            },
            {
              type: "Business Traveler's Central Suite",
              price: 250,
              capacity: "4 Adults",
              available: 4,
              description:
                "Comprehensive suite providing central location advantages, with integrated workspace and city connectivity features.",
            },
            {
              type: "Local Experience Room",
              price: 170,
              capacity: "2 Adults",
              available: 5,
              description:
                "Room designed to connect guests with Dharan's local culture, featuring city guides, local art, and cultural interaction spaces.",
            },
          ],
        },
        {
          id: "dhr7",
          name: "Hotel Gorakha",
          price: 90,
          rating: 4.5,
          location: "Dharan-Bhedetar Road",
          amenities: [
            "Mountain Views",
            "Garden Restaurant",
            "Adventure Tours",
            "Parking",
          ],
          servicesOffered: [
            "Adventure Tours",
            "Room Service",
            "Free Wi-Fi",
            "Local Tours",
          ],
          image: ["/images/d7.jpg"],
          coords: [26.8069, 87.285],
          reviews: generateRandomReviews(),
          detailsImage: ["/images/d7.jpg"],
          description:
            "This hotel offers mountain views and adventure tours, making it perfect for outdoor enthusiasts.",
          rooms: [
            {
              type: "Mountain Adventure Base Room",
              price: 160,
              capacity: "2 Adults",
              available: 5,
              description:
                "Specialized room for adventure enthusiasts, featuring gear storage, trail maps, and mountain activity planning resources.",
            },
            {
              type: "Outdoor Expedition Suite",
              price: 320,
              capacity: "4 Adults",
              available: 3,
              description:
                "Comprehensive suite for adventure lovers, with equipment maintenance area, recovery facilities, and performance tracking resources.",
            },
            {
              type: "Nature Explorer's Retreat",
              price: 220,
              capacity: "2 Adults",
              available: 4,
              description:
                "Dedicated room for nature enthusiasts, offering immersive local landscape experiences and outdoor activity insights.",
            },
          ],
        },
      ],
    },
  };
  
  module.exports = { citiesData };