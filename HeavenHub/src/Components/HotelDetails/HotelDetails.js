import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { citiesData } from "../data/citiesData"; // Import citiesData
import styles from "./HotelDetails.module.css";
import { FaHeart, FaShareAlt } from "react-icons/fa"; // Import icons
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet for marker icon
import Reserve from "../Reserve/Reserve"; // Import the new Reserve component
import { toast } from "react-toastify";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function HotelDetails({ savedProperties, setSavedProperties }) {
  const { city, id } = useParams(); // Get city from URL
  const hotel = citiesData[city]?.hotels.find((h) => h.id === id); // Find hotel by ID

  const [showAllReviews, setShowAllReviews] = useState(false); // State to manage review visibility
  const [selectedRooms, setSelectedRooms] = useState({});
  const [isFavorited, setIsFavorited] = useState(
    savedProperties[hotel.id] !== undefined
  );
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
  const [newReview, setNewReview] = useState({
    reviewer: "",
    rating: 0,
    comment: "",
  }); // State for new review
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false); // State to manage review form visibility

  // Create refs for each section
  const infoRef = useRef(null);
  const houseRulesRef = useRef(null);
  const reviewsRef = useRef(null);
  const mapRef = useRef(null); // Ref for the map
  const mapInstance = useRef(null); // Ref to store the map instance
  const roomsRef = useRef(null); // Create a ref for the rooms section

  const initMap = useCallback(() => {
    if (mapInstance.current) {
      return; // If the map is already initialized, do nothing
    }
    mapInstance.current = L.map(mapRef.current).setView(hotel.coords, 13); // Set the view to the hotel's coordinates
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(mapInstance.current);
    L.marker(hotel.coords).addTo(mapInstance.current); // Add a marker for the hotel
  }, [hotel.coords]);

  useEffect(() => {
    if (hotel) {
      initMap(); // Call the function
    }
  }, [hotel, initMap]); // Add hotel and initMap as dependencies

  const handleRoomChange = (roomType, count) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomType]: count,
    }));
  };

  const handleReserve = (roomType) => {
    setShowReservationForm(true); // Show reservation form
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reserved ${userDetails.name} using ${userDetails.paymentMethod}`);
    setShowReservationForm(false); // Close the form after submission
  };

  const handleReserveNow = () => {
    if (roomsRef.current) {
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = roomsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("userData"));

      if (!token) {
        toast.error("Please log in to add favorites");
        return;
      }

      const method = savedProperties[hotel.id] ? "DELETE" : "POST";
      const url =
        method === "DELETE"
          ? `http://localhost:4000/api/favorites/remove/${hotel.id}`
          : "http://localhost:4000/api/favorites/add";

      const imageUrl = Array.isArray(hotel.detailsImage)
        ? hotel.detailsImage[0]
        : hotel.detailsImage || "";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                propertyId: hotel.id,
                name: hotel.name,
                city: city,
                image: imageUrl,
                rating: hotel.rating || 0,
              })
            : null,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Favorite operation response:", responseData);

      setSavedProperties((prev) => {
        const newSavedProperties = { ...prev };
        if (method === "DELETE") {
          delete newSavedProperties[hotel.id];
          setIsFavorited(false);
        } else {
          newSavedProperties[hotel.id] = {
            ...hotel,
            city: city,
            isFavorite: true,
          };
          setIsFavorited(true);
        }

        // Save to localStorage for the current user
        if (currentUser) {
          localStorage.setItem(
            `favorites_${currentUser.id}`,
            JSON.stringify(newSavedProperties)
          );
        }

        return newSavedProperties;
      });

      toast.success(
        method === "DELETE"
          ? `${hotel.name} removed from favorites`
          : `${hotel.name} added to favorites`
      );
    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Add the new review to the hotel reviews
    hotel.reviews.push(newReview);
    setNewReview({ reviewer: "", rating: 0, comment: "" }); // Reset the review form
  };

  // Use hotel's rooms if available, otherwise fallback to default
  const roomData = hotel?.rooms || [
    {
      type: "Default Room",
      price: 100,
      capacity: "2 Adults",
      available: 5,
      description: "A standard room with basic amenities.",
    },
  ];

  // Check if hotel exists
  if (!hotel) {
    return <div>Hotel not found</div>; // Handle case where hotel is not found
  }

  // Check if amenities exist
  if (!hotel.amenities || !Array.isArray(hotel.amenities)) {
    return <div>No facilities available for this hotel.</div>; // Handle case where amenities are undefined or not an array
  }

  // Check if reviews exist
  if (!hotel.reviews || !Array.isArray(hotel.reviews)) {
    return <div>No reviews available for this hotel.</div>; // Handle case where reviews are undefined or not an array
  }

  // Check if detailsImage exists
  if (!hotel.detailsImage || !Array.isArray(hotel.detailsImage)) {
    return <div>No images available for this hotel.</div>; // Handle case where images are undefined or not an array
  }

  // Check if rooms exist
  if (!hotel.rooms || !Array.isArray(hotel.rooms)) {
    return <div>No rooms available for this hotel.</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Location"
            className={styles.searchInput}
            defaultValue={hotel.location} // Set default value to hotel location
          />
          <input type="date" className={styles.dateInput} />
          <input type="date" className={styles.dateInput} />
          <button className={styles.searchButton}>Search</button>
        </div>

        {/* Hotel Details */}
        <div className={styles.hotelDetails}>
          <div className={styles.header}>
            <h1 className={styles.hotelName}>{hotel.name}</h1>
            <div className={styles.actions}>
              <FaHeart
                className={styles.icon}
                style={{ color: isFavorited ? "red" : "Black" }} // Change color based on favorite status
                onClick={toggleFavorite} // Add click handler
              />
              <FaShareAlt className={styles.icon} />
            </div>
          </div>

          <div className={styles.imageGallery}>
            <div className={styles.largeImageContainer}>
              <img
                src={hotel.detailsImage[0]}
                alt="Hotel Large"
                className={styles.largeImage}
              />
            </div>
            <div className={styles.smallImages}>
              {hotel.detailsImage.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Hotel Small ${index + 1}`}
                  className={styles.galleryImage}
                />
              ))}
            </div>
          </div>

          {/* Container for Amenities and Details Below Image */}
          <div className={styles.detailsContainer}>
            {/* Amenities Section on Left Side */}
            <div className={styles.amenitiesBox}>
              <h2 className={styles.amenitiesTitle}>Amenities</h2>
              <div className={styles.amenities}>
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Box with Details on Right Side */}
            <div className={styles.priceBox}>
              <p className={styles.descriptionText}>Perfect for night stay</p>
              <button
                className={styles.reserveButton}
                onClick={handleReserveNow}
              >
                Reserve Now
              </button>
            </div>
          </div>

          {/* Apartment Description Below Amenities */}
          <p className={styles.apartmentDescription}>
            <strong>Apartment Description</strong>
          </p>
          <p className={styles.apartmentDetails}>{hotel.description}</p>
        </div>

        {/* Map Container at the Bottom */}
        <div className={styles.mapContainerWrapper}>
          <div ref={mapRef} className={styles.mapContainer}></div>
        </div>

        {/* Additional Sections Below Location and Map */}
        <div ref={infoRef} className={styles.infoSection}>
          <div className={styles.infoContainer}>
            {/* Services Offered Section */}
            <div className={styles.servicesSection}>
              <h2 className={styles.servicesTitle}>Services Offered</h2>
              <div className={styles.servicesContainer}>
                {hotel.servicesOffered.map((service, index) => (
                  <div key={index} className={styles.serviceItem}>
                    {service}
                  </div>
                ))}
              </div>
            </div>

            {/* All Available Rooms Section */}
            <div ref={roomsRef} className={styles.roomsSection}>
              <h2 className={styles.roomsTitle}>All Available Rooms</h2>
              <table className={styles.roomsTable}>
                <thead>
                  <tr>
                    <th>Room Type</th>
                    <th>Price for Rooms</th>
                    <th>Capacity</th>
                    <th>Availability</th>
                    <th>Description</th>
                    <th>Select Rooms</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {roomData.map(
                    ({ type, price, capacity, available, description }) => (
                      <tr key={type}>
                        <td>{type}</td>
                        <td>${price}</td>
                        <td>{capacity}</td>
                        <td>{available} available</td>
                        <td>{description}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={available}
                            value={selectedRooms[type] || 0}
                            onChange={(e) =>
                              handleRoomChange(type, e.target.value)
                            }
                            style={{ width: "60px" }}
                          />
                          <button
                            onClick={() => handleReserve(type)}
                            disabled={
                              !selectedRooms[type] ||
                              selectedRooms[type] > available
                            }
                          >
                            Reserve
                          </button>
                        </td>
                        <td>
                          $
                          {selectedRooms[type]
                            ? selectedRooms[type] * price
                            : 0}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div ref={houseRulesRef} className={styles.houseRulesSection}>
          <h2 className={styles.houseRulesTitle}>House Rules</h2>
          <div className={styles.rulesSection}>
            <table className={styles.rulesTable}>
              <thead>
                <tr>
                  <th>Rule</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Check-in</td>
                  <td>From 3 PM</td>
                </tr>
                <tr>
                  <td>Check-out</td>
                  <td>Until 11 AM</td>
                </tr>
                <tr>
                  <td>Pets</td>
                  <td>No pets allowed</td>
                </tr>
                {/* Add more rules as needed */}
              </tbody>
            </table>
          </div>
        </div>

        <div ref={reviewsRef} className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Guest Reviews</h2>
          <div className={styles.reviewsContainer}>
            {hotel.reviews
              .slice(0, showAllReviews ? hotel.reviews.length : 2)
              .map((review, index) => (
                <div key={index} className={styles.reviewCard}>
                  <h3 className={styles.reviewerName}>{review.reviewer}</h3>
                  <p className={styles.reviewRating}>
                    {"★".repeat(review.rating)}
                  </p>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
          </div>
          {hotel.reviews.length > 2 && !showAllReviews && (
            <button
              onClick={() => setShowAllReviews(true)}
              className={styles.seeMoreButton}
            >
              See More
            </button>
          )}
          {showAllReviews && (
            <button
              onClick={() => setShowAllReviews(false)}
              className={styles.seeMoreButton}
            >
              See Less
            </button>
          )}

          {/* Write Review Button */}
          <button
            onClick={() => setIsReviewFormVisible((prev) => !prev)} // Toggle review form visibility
            className={styles.writeReviewButton}
          >
            {isReviewFormVisible ? "Cancel" : "Write Review"}
          </button>

          {/* Review Submission Form */}
          {isReviewFormVisible && (
            <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.reviewer}
                onChange={(e) =>
                  setNewReview({ ...newReview, reviewer: e.target.value })
                }
                required
              />
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Write your review"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
              />
              <button type="submit" className={styles.submitReviewButton}>
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* Reservation Form Modal */}
        {showReservationForm && (
          <Reserve
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            handleSubmit={handleSubmit}
            setShowReservationForm={setShowReservationForm}
          />
        )}
      </div>
    </div>
  );
}

export default HotelDetails;
