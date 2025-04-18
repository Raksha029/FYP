import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./HotelDetails.module.css";
import { 
  FaHeart, 
  FaShareAlt, 
  FaStar, 
  FaBed, 
  FaConciergeBell, 
  FaUtensils, 
  FaSpa, 
  FaCoffee, 
  FaCocktail, 
  FaSwimmingPool,
  FaDumbbell,
  FaWifi,
  FaParking,
  FaBriefcase,
  FaBuilding,  // Replace FaMeetingRoom with FaBuilding
  FaTshirt,
  FaShuttleVan,
  FaCheck
} from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Reserve from "../Reserve/Reserve";
import { toast } from "react-toastify";
import { 
  FaClock,
  FaCalendarAlt,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";

// Add this after amenityIcons object
const policyIcons = {
  checkIn: <FaClock />,
  checkOut: <FaSignOutAlt />,
  cancellation: <FaCalendarAlt />,
  payment: <FaCreditCard />
};

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Update the amenityIcons object to match exact amenity names
const amenityIcons = {
  // Room Types
  "Luxury Rooms": <FaBed />,
  "Standard Room": <FaBed />,
  "Deluxe Room": <FaBed />,
  "Suite": <FaBed />,
  
  // Dining
  "Restaurant": <FaUtensils />,
  "Multiple Restaurants": <FaUtensils />,
  "Cafe": <FaCoffee />,
  "Bar": <FaCocktail />,
  "Executive Lounge": <FaConciergeBell />,
  
  // Facilities
  "Swimming Pool": <FaSwimmingPool />,
  "Spa": <FaSpa />,
  "Fitness Center": <FaDumbbell />,
  "Gym": <FaDumbbell />,
  "Free WiFi": <FaWifi />,
  "Internet": <FaWifi />,
  "Parking": <FaParking />,
  "Free Parking": <FaParking />,
  
  // Additional Services
  "Room Service": <FaConciergeBell />,
  "Business Center": <FaBriefcase />,
  "Conference Room": <FaBuilding />, // Update this line
  "Laundry": <FaTshirt />,
  "Airport Shuttle": <FaShuttleVan />
};

const handleShare = async () => {
  const shareData = {
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      toast.success("Link created successfully!");
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Failed to share link");
    }
  } else {
    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy link. Please try again.");
    }
  }
};



function HotelDetails({ savedProperties, setSavedProperties }) {
  const { city, id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false); // State to manage review visibility
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false); // State to manage reservation form visibility
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
    paperlessConfirmation: false,
    bookingFor: "mainGuest", // Default value
  }); // State for user details
  const [mapContainerRef, setMapContainerRef] = useState(null);
  const mapInstanceRef = useRef(null);

  // For future review functionality
  // eslint-disable-next-line no-unused-vars
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  // For future user authentication
  // eslint-disable-next-line no-unused-vars
  const currentUser = null; // Will be implemented with auth

  // Add a new state for the selected room
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Add a new state for room counts
  const [roomCounts, setRoomCounts] = useState({});

  // Image handling component
  const ImageWithFallback = ({ src, alt, className }) => {
    const handleError = (e) => {
      e.target.src = "/images/fallback-hotel.jpg";
    };

    return (
      <div className={styles.imageWrapper}>
        <img src={src} alt={alt} className={className} onError={handleError} />
      </div>
    );
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/cities/${city}/hotels/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch hotel details");
        const data = await response.json();

        console.log("Original hotel data:", data);
        console.log("Coordinates:", data.coords); // Debug the coordinates

        const transformImagePaths = (images) => {
          if (!images) return [];
          return images
            .map((img) => {
              if (!img) return null;
              if (img.startsWith("http")) return img;
              if (img.startsWith("/images"))
                return `http://localhost:4000${img}`;
              return `http://localhost:4000/images/${img}`;
            })
            .filter(Boolean);
        };

        const transformedData = {
          ...data,
          detailsImage: transformImagePaths(data.detailsImage),
          image: transformImagePaths(data.image),
        };

        console.log("Transformed hotel data:", transformedData);

        setHotel(transformedData);
        setIsFavorited(savedProperties && savedProperties[id] !== undefined);

        // Replace missing coordinates with default ones for testing
        if (!transformedData.coords || transformedData.coords.length !== 2) {
          console.log("Using default coordinates for testing");
          const defaultCoords = [27.7172, 85.324]; // Example coordinates for Kathmandu
          transformedData.coords = defaultCoords;
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [city, id, savedProperties]);

  // Add this eslint-disable-next-line comment before the useEffect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log("Map container ref:", mapContainerRef);

    if (hotel && hotel.coords && mapContainerRef) {
      // Check if a map instance already exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create a new map instance
      const newMap = L.map(mapContainerRef).setView(hotel.coords, 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(newMap);

      // Add a marker for the hotel location
      L.marker(hotel.coords)
        .addTo(newMap)
        .bindPopup(`<b>${hotel.name}</b><br>${hotel.location}`)
        .openPopup();

      // Save the map instance to the ref
      mapInstanceRef.current = newMap;

      // Force a resize for any layout issues
      setTimeout(() => {
        newMap.invalidateSize();
      }, 100);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hotel, mapContainerRef]); // Add mapContainerRef to dependencies

  // Calculate dynamic price based on availability
  const calculateDynamicPrice = (basePrice, available) => {
    // Apply dynamic pricing - increase price as availability decreases
    if (available <= 2) {
      return Math.round(basePrice * 1.3); // 30% markup for high demand
    } else if (available <= 5) {
      return Math.round(basePrice * 1.15); // 15% markup for medium demand
    }
    return basePrice; // Normal price for good availability
  };

  // Handle room count change
  const handleRoomCountChange = (roomType, count) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomType]: count,
    }));
  };

  // Update the handleReserve function
  const handleReserve = (room) => {
    if (room.available <= 0) {
      toast.error("Sorry, this room is no longer available");
      return;
    }

    // Get the selected count for this room (default to 1 if not set)
    const count = roomCounts[room.type] || 1;

    // Calculate the total price
    const price = calculateDynamicPrice(room.price, room.available) * count;

    // Save the selected room with count and total price
    setSelectedRoom({
      ...room,
      count: count,
      totalPrice: price,
      hotelId: id,
      hotelName: hotel.name,
    });

    setShowReservationForm(true);
  };

  // Remove the unused handleSubmit function since we're using Reserve component now

  // Add handleBookingComplete function
  const handleBookingComplete = (hotelId, roomType, bookedCount) => {
    setHotel(prevHotel => {
      if (!prevHotel) return prevHotel;

      const updatedHotel = { ...prevHotel };
      const roomToUpdate = updatedHotel.rooms.find(room => room.type === roomType);
      
      if (roomToUpdate) {
        roomToUpdate.available = Math.max(0, roomToUpdate.available - bookedCount);
      }
      
      return updatedHotel;
    });
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to add favorites");
        return;
      }

      const method = savedProperties[id] ? "DELETE" : "POST";
      const url =
        method === "DELETE"
          ? `http://localhost:4000/api/favorites/remove/${id}`
          : "http://localhost:4000/api/favorites/add";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                propertyId: id,
                name: hotel.name,
                city: city.toLowerCase(),
                image: Array.isArray(hotel.image)
                  ? hotel.image[0]
                  : hotel.image,
                rating: hotel.rating || 0,
              })
            : null,
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      // Update saved properties state
      if (method === "DELETE") {
        const { [id]: removed, ...rest } = savedProperties;
        setSavedProperties(rest);
        setIsFavorited(false);
      } else {
        setSavedProperties({
          ...savedProperties,
          [id]: {
            ...hotel,
            isFavorite: true,
            propertyId: id,
            city: city.toLowerCase(),
          },
        });
        setIsFavorited(true);
      }

      toast.success(
        method === "DELETE" ? "Removed from favorites" : "Added to favorites"
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Render images function
  const renderImages = () => {
    if (!hotel?.detailsImage?.length) return null;

    return (
      <div className={styles.imageGallery}>
        {hotel.detailsImage.map((image, index) => (
          <ImageWithFallback
            key={index}
            src={image}
            alt={`${hotel.name} - Image ${index + 1}`}
            className={styles.galleryImage}
          />
        ))}
      </div>
    );
  };

  // Update the handleReviewSubmit function to get the real username
  const handleReviewSubmit = async () => {
    try {
      if (!newReview.comment.trim()) {
        toast.error("Please add a comment to your review");
        return;
      }

      // Get token - required for authentication
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to submit a review");
        return;
      }

      // Get the username from localStorage
      let username = "Guest User";

      // Try multiple locations where user data might be stored
      try {
        // First check if there's a username directly stored
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
          username = storedUsername;
        } else {
          // Check if user data is stored as JSON
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          if (userData.name) {
            username = userData.name;
          } else if (userData.username) {
            username = userData.username;
          } else if (userData.firstName) {
            username =
              userData.firstName +
              (userData.lastName ? " " + userData.lastName : "");
          }
        }
      } catch (e) {
        console.log("Error getting user data:", e);
      }

      console.log("Submitting review as:", username);

      const response = await fetch(
        `http://localhost:4000/api/cities/${city}/hotels/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: newReview.rating,
            comment: newReview.comment,
            reviewer: username,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      // Get the updated hotel data with the new review
      const updatedHotel = await response.json();

      // Update the hotel state with the new data including the new review
      setHotel(updatedHotel);

      // Reset the review form
      setNewReview({
        rating: 5,
        comment: "",
      });

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!hotel) {
    return <div className={styles.notFound}>Hotel not found</div>;
  }

  // Remove detailsImage from destructuring since we're accessing it via hotel.detailsImage
  const {
    name = "",
    location = "",
    coords = null,
    rooms = [],
    amenities = [],
    reviews = [],
    rating = 0,
    description = "",
    price = 0,
  } = hotel;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{name}</h1>
            <div className={styles.location}>{location}</div>
            <div className={styles.rating}>Rating: {rating} ★</div>
          </div>
          <div className={styles.actions}>
            <FaHeart
              className={`${styles.icon} ${isFavorited ? styles.favorited : ""}`}
              onClick={toggleFavorite}
            />
            <button className={styles.shareButton} onClick={handleShare}>
            <FaShareAlt className={styles.icon} />
</button>

            
          </div>
        </div>

        {/* Image Gallery */}
        {renderImages()}

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Description */}
            <section className={styles.section}>
              <h2>About this hotel</h2>
              <p className={styles.description}>{description}</p>
            </section>

            {/* Amenities */}
            <section className={styles.section}>
              <h2>Popular amenities</h2>
              <div className={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>
                      {amenityIcons[amenity] || <FaCheck />}
                    </span>
                    <span className={styles.amenityText}>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Map */}
            <section className={styles.section}>
              <h2>Location</h2>
              {coords && (
                <div
                  ref={(el) => {
                    setMapContainerRef(el);
                  }}
                  className={styles.mapContainer}
                  style={{ height: "400px", width: "100%" }}
                >
                  {/* Map will be initialized here */}
                </div>
              )}
              {!coords && <p>Map location not available</p>}
            </section>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Hotel Policies</h2>
              <div className={styles.policiesGrid}>
                {['checkIn', 'checkOut', 'cancellation', 'payment'].map((key) => (
                  <div key={key} className={styles.policyItem}>
                    <span className={styles.policyIcon}>
                      {policyIcons[key]}
                    </span>
                    <div className={styles.policyContent}>
                      <h3 className={styles.policyTitle}>
                        {key === 'checkIn' ? 'Check In' :
                         key === 'checkOut' ? 'Check Out' :
                         key === 'cancellation' ? 'Cancellation' :
                         'Payment'}
                      </h3>
                      <p className={styles.policyText}>{hotel.policies?.[key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Section */}
            <section className={styles.section}>
              <h2>Guest Reviews</h2>
              <div className={styles.reviewsContainer}>
                {reviews
                  .slice(0, showAllReviews ? undefined : 3)
                  .map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <span className={styles.reviewerName}>{review.reviewer}</span>
                          <div className={styles.reviewRating}>
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < review.rating ? styles.starFilled : styles.starEmpty}
                              />
                            ))}
                          </div>
                        </div>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                      <p className={styles.reviewText}>{review.comment}</p>
                    </div>
                ))}
                {reviews.length > 3 && (
                  <button
                    className={styles.seeMoreButton}
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Show Less" : "See More Reviews"}
                  </button>
                )}
              </div>

              {/* Leave a Review Section */}
              <div className={styles.addReviewSection}>
                <h3 className={styles.addReviewTitle}>Leave a Review</h3>
                <div className={styles.ratingContainer}>
                  <span className={styles.ratingText}>Your Rating</span>
                  <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${styles.starIcon} ${
                          newReview.rating >= star ? styles.active : ''
                        }`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      />
                    ))}
                  </div>
                </div>
                <textarea
                  className={styles.reviewTextArea}
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
                <button
                  className={styles.submitReviewButton}
                  onClick={handleReviewSubmit}
                  disabled={!newReview.comment.trim()}
                >
                  Submit Review
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Section */}
          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Starting from</span>
                <h2 className={styles.price}>NPR {price}</h2>
                <span className={styles.perNight}>per night</span>
              </div>

              <div className={styles.roomsSection}>
                <h3>Available Rooms</h3>
                {rooms.map((room, index) => {
                  const dynamicPrice = calculateDynamicPrice(
                    room.price,
                    room.available
                  );
                  const count = roomCounts[room.type] || 1;
                  const totalPrice = dynamicPrice * count;

                  return (
                    <div key={index} className={styles.roomCard}>
                      <div className={styles.roomInfo}>
                        <h4>{room.type}</h4>
                        <p>{room.description}</p>
                        <p>Capacity: {room.capacity}</p>
                        <p className={styles.roomPrice}>
                          NPR {dynamicPrice}/night
                          {dynamicPrice > room.price && (
                            <span className={styles.priceSurge}>
                              {" "}
                              (Limited availability pricing)
                            </span>
                          )}
                        </p>
                        <p className={styles.availability}>
                          {room.available > 0
                            ? `${room.available} rooms available`
                            : "Currently unavailable"}
                        </p>

                        {room.available > 0 && (
                          <div className={styles.roomCountSelector}>
                            <label htmlFor={`roomCount-${index}`}>
                              Number of rooms:
                            </label>
                            <select
                              id={`roomCount-${index}`}
                              value={count}
                              onChange={(e) =>
                                handleRoomCountChange(
                                  room.type,
                                  parseInt(e.target.value)
                                )
                              }
                            >
                              {[...Array(room.available)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                            <p className={styles.totalPrice}>
                              Total: NPR {totalPrice}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        className={styles.reserveButton}
                        onClick={() => handleReserve(room)}
                        disabled={room.available <= 0}
                      >
                        Reserve Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Reservation Form Modal */}
      {showReservationForm && (
        <Reserve
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          onClose={() => setShowReservationForm(false)}
          selectedRoom={selectedRoom}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
}

export default HotelDetails;

