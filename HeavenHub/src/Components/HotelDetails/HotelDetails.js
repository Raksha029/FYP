import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  // Image handling component
  const ImageWithFallback = ({ src, alt, className }) => {
    const handleError = (e) => {
      console.error(` Image load error for: ${src}`);
      e.target.src = "/logo192.png";
    };

    return (
      <img src={src} alt={alt} className={className} onError={handleError} />
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

  const handleReserve = (roomType) => {
    setShowReservationForm(true); // Show reservation form
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Reserved ${userDetails.name} using ${userDetails.paymentMethod}`);
    setShowReservationForm(false); // Close the form after submission
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

  // eslint-disable-next-line no-unused-vars
  const handleReviewSubmit = () => {
    // Implementation coming soon
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
              className={`${styles.icon} ${
                isFavorited ? styles.favorited : ""
              }`}
              onClick={toggleFavorite}
            />
            <FaShareAlt className={styles.icon} />
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
                    {amenity}
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

            {/* Reviews */}
            <section className={styles.section}>
              <h2>Guest Reviews</h2>
              <div className={styles.reviewsContainer}>
                {reviews
                  .slice(0, showAllReviews ? undefined : 3)
                  .map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewer}>
                          {review.reviewer}
                        </span>
                        <span className={styles.rating}>{review.rating} ★</span>
                      </div>
                      <p className={styles.comment}>{review.comment}</p>
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
            </section>
          </div>

          {/* Right Column - Booking Section */}
          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Starting from</span>
                <h2 className={styles.price}>${price}</h2>
                <span className={styles.perNight}>per night</span>
              </div>

              <div className={styles.roomsSection}>
                <h3>Available Rooms</h3>
                {rooms.map((room, index) => (
                  <div key={index} className={styles.roomCard}>
                    <div className={styles.roomInfo}>
                      <h4>{room.type}</h4>
                      <p>{room.description}</p>
                      <p>Capacity: {room.capacity}</p>
                      <p className={styles.roomPrice}>${room.price}/night</p>
                    </div>
                    <button
                      className={styles.reserveButton}
                      onClick={() => handleReserve(room.type)}
                    >
                      Reserve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <Reserve
          onClose={() => setShowReservationForm(false)}
          onSubmit={handleSubmit}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      )}
    </div>
  );
}

export default HotelDetails;