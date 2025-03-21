import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./TopRatedProperties.module.css";
import { citiesData } from "../data/citiesData";
import { FaHeart } from "react-icons/fa";

// Utility function to safely get top hotels
const getTopHotelsFromCities = () => {
  const cities = [
    "kathmandu",
    "pokhara",
    "lalitpur",
    "nagarkot",
    "baktapur",
    "lumbini",
    "janakpur",
    "dharan",
  ];
  const bestHotels = [];

  cities.forEach((city) => {
    try {
      // Extremely defensive programming
      if (!citiesData[city]?.hotels) {
        console.warn(`No hotels found for city: ${city}`);
        return;
      }

      const validHotels = citiesData[city].hotels
        .filter(
          (hotel) =>
            hotel &&
            hotel.id &&
            hotel.name &&
            hotel.rating !== undefined &&
            hotel.image // Ensure image exists
        )
        .sort((a, b) => b.rating - a.rating);

      if (validHotels.length > 0) {
        const topHotel = {
          ...validHotels[0],
          city,
        };
        bestHotels.push(topHotel);
      }
    } catch (error) {
      console.error(`Error processing city ${city}:`, error);
    }
  });

  // Final sorting and slicing
  return bestHotels.sort((a, b) => b.rating - a.rating).slice(0, 10);
};

const TopRatedProperties = ({ savedProperties = {}, setSavedProperties }) => {
  const [properties, setProperties] = useState([]);
  const scrollContainerRef2 = useRef(null);

  // Initialize properties on component mount
  useEffect(() => {
    const topProperties = getTopHotelsFromCities();
    setProperties(topProperties);
  }, []);

  const handleHeartClick = async (property) => {
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("userData"));

      if (!token) {
        toast.error("Please log in to add favorites");
        return;
      }

      const method = savedProperties[property.id] ? "DELETE" : "POST";
      const url =
        method === "DELETE"
          ? `http://localhost:4000/api/favorites/remove/${property.id}`
          : "http://localhost:4000/api/favorites/add";

      console.log("Sending request to:", url); // Debugging log

      // Ensure image is a string, not an array
      const imageUrl = Array.isArray(property.image)
        ? property.image[0]
        : property.image || "";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:
          method === "POST"
            ? JSON.stringify({
                propertyId: property.id,
                name: property.name,
                city: property.city || "",
                image: imageUrl,
                rating: property.rating || 0,
              })
            : null,
      });

      console.log("Response status:", response.status); // Debugging log

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Log or use the response data to remove the eslint warning
      const responseData = await response.json();
      console.log("Response result:", responseData);

      setSavedProperties((prev) => {
        const newSavedProperties = { ...prev };
        if (method === "DELETE") {
          delete newSavedProperties[property.id];
        } else {
          newSavedProperties[property.id] = {
            ...property,
            isFavorite: true,
          };
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
          ? `${property.name} removed from favorites`
          : `${property.name} added to favorites`
      );
    } catch (error) {
      console.error("Detailed error:", error);
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  };

  // Render fallback if no properties
  if (properties.length === 0) {
    return (
      <section className={styles.topRatedSection}>
        <h3 className={styles.sectionTitle}>Top Rated Properties</h3>
        <p>No properties found. Please check your data source.</p>
      </section>
    );
  }

  return (
    <section className={styles.topRatedSection}>
      <h3 className={styles.sectionTitle}>Top Rated Properties</h3>
      <div className="relative">
        <div ref={scrollContainerRef2} className={styles.scrollContainer}>
          {properties.map((property, index) => {
            // Additional safety check
            if (!property || !property.id) {
              console.warn(`Skipping invalid property at index ${index}`);
              return null;
            }

            // Check if the property is saved
            const isSaved = savedProperties[property.id] !== undefined;

            return (
              <div
                key={property.id}
                className={`${styles.propertyCard} ${
                  index < 4 ? styles.static : styles.scrollable
                }`}
              >
                <Link to={`/hotel-details/${property.city}/${property.id}`}>
                  <div className={styles.imageContainer}>
                    <img
                      src={property.image || "/default-hotel.jpg"}
                      alt={property.name || "Property"}
                      className={styles.propertyImage}
                      onError={(e) => {
                        e.target.src = "/default-hotel.jpg";
                        console.warn(`Image load error for ${property.name}`);
                      }}
                    />
                    <div
                      className={styles.savedIcon}
                      onClick={(e) => {
                        e.preventDefault();
                        handleHeartClick(property);
                      }}
                    >
                      <FaHeart
                        className={`${styles.heartIcon} ${
                          isSaved ? styles.saved : ""
                        }`}
                      />
                    </div>
                  </div>
                </Link>

                {/* Property Details */}
                <div className={styles.propertyDetails}>
                  <h4 className={styles.propertyName}>{property.name}</h4>
                  <div className={styles.propertyInfo}>
                    <span className={styles.location}>{property.location}</span>
                    <span className={styles.rating}>
                      ⭐ {property.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>NPR {property.price}</span>
                    <span className={styles.perNight}>per night</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopRatedProperties;
