import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./HotelDetails.module.css";
import { FaHeart, FaShareAlt } from "react-icons/fa"; // Import icons
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet"; // Import Leaflet for marker icon
import Reserve from "../Reserve/Reserve"; // Import the new Reserve component
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';


// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});



function HotelDetails({ savedProperties, setSavedProperties }) {
  const { addNotification } = useNotification();
  const { t} = useTranslation();
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

  
const handleShare = async () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    toast.error(t('loginToShare'));
    return;
  }

  const shareData = {
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      addNotification({
        type: 'share',
        message: t('hotelShared', { hotelName: hotel.name }),
        time: new Date().toLocaleTimeString()
        });
      toast.success(t('linkCreatedSuccess'));
    } catch (err) {
      console.error("Share failed:", err);
      toast.error(t('shareLinkFailed'));
    }
  } else {
    // Fallback to clipboard copy
    try {
      await navigator.clipboard.writeText(shareData.url);
      addNotification({
        type: 'share',
        message: t('hotelLinkCopied', { hotelName: hotel.name }),
        time: new Date().toLocaleTimeString()
      });
      toast.success(t('linkCopiedSuccess'));
    } catch (err) {
      toast.error(t('copyLinkFailed'));
    }
  }
};


  // Add a new state for the selected room
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Add a new state for room counts
  const [roomCounts, setRoomCounts] = useState({});

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

  // Move useCallback outside useEffect
  const fetchHotelDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/cities/${city}/hotels/${id}?ts=${Date.now()}`
      );
      if (!response.ok) throw new Error("Failed to fetch hotel details");
      const data = await response.json();

      console.log("Original hotel data:", data);
      console.log("Coordinates:", data.coords); // Debug the coordinates

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
  }, [city, id, savedProperties]);

  useEffect(() => {
    fetchHotelDetails();
    
    // Add interval cleanup properly
    const interval = setInterval(fetchHotelDetails, 30000);
    return () => clearInterval(interval);
  }, [fetchHotelDetails]);

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
        .bindPopup(`<b>${t(`hotel.${hotel.name}`) || hotel.name}</b><br>${t(`location.${hotel.location}`) || hotel.location}`)
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
  }, [hotel, mapContainerRef, t]); // Added 't' to the dependency array

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
    addNotification({
      type: 'booking',
      messageKey: 
      'bookingStarted',
  messageParams: { 
    hotelName: hotel.name,
    roomType: room.type 
  },
  message: t('bookingStarted', { 
    hotelName: hotel.name,
    roomType: room.type 
  }),
  time: new Date().toLocaleTimeString()
});

addNotification({
  type: 'success',
  message: t('pointsEarned', {
    points: 100, hotelName: hotel.name
  }),
  time: new Date().toLocaleTimeString()
});

const existingAdminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
localStorage.setItem('adminNotifications', JSON.stringify([{
  id: Date.now(),
  type: 'booking_new',
  message: `New booking at ${hotel.name} - ${count} ${room.type} room(s)`,
  time: new Date().toLocaleTimeString(),
  timestamp: Date.now(),
  read: false
}, ...existingAdminNotifications]));

  };

  const handleBookingComplete = (roomType, bookedCount) => {
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
        toast.error(t('loginToFavorite'));
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
        addNotification({
          type: 'favorite',
          messageKey: 'removedFromFavorites1',
          messageParams: { hotelName: hotel.name },
          message: t('removedFromFavorites1', { hotelName: hotel.name }),
          time: new Date().toLocaleTimeString()
});
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
        addNotification({
          type: 'favorite',
          messageKey: 'addedToFavorites1',
          messageParams: { hotelName: hotel.name },
          message: t('addedToFavorites1', { hotelName: hotel.name }),
          time: new Date().toLocaleTimeString()
});
      }

      toast.success(
        method === "DELETE" ? t('removedFromFavorites') : t('addedToFavorites')
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error(t('failedToUpdateFavorites'));
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

  const transformImagePaths = (images) => {
    if (!images) return [];
    return images
      .map((img) => {
        if (!img) return null;
        if (img.startsWith("http")) return img;
        if (img.startsWith("/uploads"))
          return `http://localhost:4000${img}`;
        if (img.startsWith("/images"))
          return `http://localhost:4000${img}`;
        return `http://localhost:4000/images/${img}`;
      })
      .filter(Boolean);
  };

  const handleReviewSubmit = async () => {
    try {
      if (!newReview.comment.trim()) {
        toast.error(t('addCommentPrompt'));
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t('loginToReview'));
        return;
      }
  
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
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }
  
      const updatedHotelData = await response.json();
  
      // Transform the data with proper image paths
      const transformedData = {
        ...updatedHotelData,
        detailsImage: transformImagePaths(updatedHotelData.detailsImage),
        image: transformImagePaths(updatedHotelData.image),
      };
  
      // Update the hotel state with transformed data
      setHotel(transformedData);

      addNotification({type: 'review',
        messageKey: 'reviewSubmitted',
        messageParams: { hotelName: hotel.name,
          rating: newReview.rating},
        message: t('reviewSubmitted', { hotelName: hotel.name,
          rating: newReview.rating}),
        time: new Date().toLocaleTimeString()});

  
      // Reset the review form
      setNewReview({
        rating: 5,
        comment: "",
      });
  
      toast.success(t('reviewSubmitSuccess'));
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || t('reviewSubmitError'));
    }
  };

  if (loading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={styles.error}>{t('error', { message: error })}</div>;
  }

  if (!hotel) {
    return <div className={styles.notFound}>{t('notFound')}</div>;
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
            <h1 className={styles.title}>
              {t('hotelName', { 
                name: t(`hotel.${name}`) || name 
              })}
            </h1>
            <div className={styles.location}>
              {t('hotelLocation', { 
                location: t(`location.${location}`) || location 
              })}
            </div>
            <div className={styles.rating}>
              {t('hotelRating', { rating: rating })}
            </div>
          </div>
          <div className={styles.actions}>
            <FaHeart
              className={`${styles.icon} ${
                isFavorited ? styles.favorited : ""
              }`}
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
              <h2>{t('aboutHotelTitle')}</h2>
              <p className={styles.description}>
                {t(`hotelDescription.${name.replace(/[^a-zA-Z0-9]/g, '')}`) || description}
              </p>
            </section>

            {/* Amenities */}
            <section className={styles.section}>
              <h2>{t('popularAmenities')}</h2>
              <div className={styles.amenitiesGrid}>
                {amenities.map((amenity, index) => (
                  <div key={index} className={styles.amenityItem}>
                    {t(`amenities.${amenity}`)}
                  </div>
                ))}
              </div>
            </section>

            {/* Map */}
            <section className={styles.section}>
              <h2>{t('locationTitle')}</h2>
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
              {!coords && <p>{t('mapNotAvailable')}</p>}
            </section>

            {/* Reviews */}
            <section className={styles.section}>
              <h2>{t('guestReviews')}</h2>
              <div className={styles.reviewsContainer}>
                {reviews
                  .slice(0, showAllReviews ? undefined : 3)
                  .map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewer}>
                          {t('reviewerName', { name: review.reviewer })}
                        </span>
                        <span className={styles.rating}>
                          {t('reviewRating', { rating: review.rating })}
                        </span>
                      </div>
                      <p className={styles.comment}>
                        {t('reviewComment', { comment: review.comment })}
                      </p>
                    </div>
                  ))}
                {reviews.length > 3 && (
                  <button
                    className={styles.seeMoreButton}
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? t('showLess') : t('seeMoreReviews')}
                  </button>
                )}
              </div>

              {/* Add Review Form */}
              <div className={styles.addReviewSection}>
                <h3>{t('leaveReview')}</h3>
                <div className={styles.ratingSelector}>
                  <span>{t('yourRating')} </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`${styles.ratingStar} ${
                        newReview.rating >= star ? styles.activeStar : ""
                      }`}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className={styles.reviewInput}
                  placeholder={t('shareExperience')}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                />
                <button
                  className={styles.submitReviewButton}
                  onClick={handleReviewSubmit}
                  disabled={!newReview.comment.trim()}
                >
                  {t('submitReview')}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Section */}
          <div className={styles.rightColumn}>
            <div className={styles.bookingCard}>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>{t('startingFrom')}</span>
                <h2 className={styles.price}>{t('currency')} {price}</h2>
                <span className={styles.perNight}>{t('perNight')}</span>
              </div>

              <div className={styles.roomsSection}>
                <h3>{t('availableRooms')}</h3>
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
                        <h4>{t(`roomType.${hotel.name}.${room.type}`)}</h4>
                        <p>{t(`roomDescription.${hotel.name}.${room.type}`)}</p>
                        <p>{t('capacity')} {room.capacity}</p>
                        <p className={styles.roomPrice}>
                          {t('currency')} {dynamicPrice.toLocaleString('en-NP')}/night
                          {dynamicPrice > room.price && (
                            <span className={styles.priceSurge}>
                              {" "}
                              ({t('limitedAvailabilityPricing')})
                            </span>
                          )}
                        </p>
                        <p className={styles.availability}>
                          {room.available > 0
                            ? t('roomsAvailable', { count: room.available })
                            : t('currentlyUnavailable')}
                        </p>

                        {room.available > 0 && (
                          <div className={styles.roomCountSelector}>
                            <label htmlFor={`roomCount-${index}`}>
                              {t('numberOfRooms')}
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
                              {t('total')} {totalPrice}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        className={styles.reserveButton}
                        onClick={() => handleReserve(room)}
                        disabled={room.available <= 0}
                      >
                        {t('reserveNow')}
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