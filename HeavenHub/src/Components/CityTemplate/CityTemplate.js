import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";

import styles from "./CityTemplate.module.css";
import L from "leaflet";
import { FaHeart } from "react-icons/fa";

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const calculateHotelScore = (hotel) => {
  // Calculate score based on ratings and number of reviews
  const averageRating = hotel.rating || 0;
  const numberOfReviews = hotel.reviews?.length || 0;
  
  // Weight factors (can be adjusted)
  const ratingWeight = 0.6;
  const reviewCountWeight = 0.4;
  
  // Calculate weighted score
  const ratingScore = averageRating * ratingWeight;
  const reviewScore = (numberOfReviews / 1000) * reviewCountWeight; // Normalize by assuming max 1000 reviews
  
  return ratingScore + reviewScore;
};

const CityTemplate = ({ cityData, savedProperties, setSavedProperties }) => {
  const { name, referencePoint, centerName } = cityData;
  const [searchTerm, setSearchTerm] = useState("");
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    priceRange: [0, 5000],
    rating: 0,
    amenities: [],
    maxDistance: 100,
  });
  const [sortBy, setSortBy] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/cities/${name.toLowerCase()}/hotels`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch hotels for ${name}`);
        }

        const data = await response.json();
        
        // Sort hotels by calculated score
        const sortedHotels = data.sort((a, b) => {
          const scoreA = calculateHotelScore(a);
          const scoreB = calculateHotelScore(b);
          return scoreB - scoreA; // Sort in descending order
        });

        setAllHotels(sortedHotels);
        setFilteredHotels(sortedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error(`Could not load hotels for ${name}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [name]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredHotels(allHotels);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredHotels(allHotels);
      return;
    }

    const filtered = allHotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  };

  // Add this new useEffect to handle all filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allHotels];

      // Apply price range filter
      filtered = filtered.filter(
        (hotel) => hotel.price >= filter.priceRange[0] && hotel.price <= filter.priceRange[1]
      );

      // Apply rating filter
      if (filter.rating > 0) {
        filtered = filtered.filter((hotel) => hotel.rating >= filter.rating);
      }

      // Apply amenities filter
      if (filter.amenities.length > 0) {
        filtered = filtered.filter((hotel) =>
          filter.amenities.every((amenity) => 
            hotel.amenities?.includes(amenity)
          )
        );
      }

      // Apply distance filter
      filtered = filtered.filter((hotel) => {
        const distance = getDistance(
          referencePoint.lat,
          referencePoint.lon,
          hotel.coords[0],
          hotel.coords[1]
        );
        return distance <= filter.maxDistance;
      });

      // Apply search term filter
      if (searchTerm.trim()) {
        filtered = filtered.filter((hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      if (sortBy) {
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "price":
              return a.price - b.price;
            case "rating":
              return b.rating - a.rating;
            case "recommended":
              const scoreA = calculateHotelScore(a);
              const scoreB = calculateHotelScore(b);
              return scoreB - scoreA;
            default:
              return 0;
          }
        });
      }

      setFilteredHotels(filtered);
    };

    applyFilters();
  }, [filter, searchTerm, sortBy, allHotels, referencePoint]);

  // Update handleFilterChange to trigger immediate filter application
  const handleFilterChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  // Update handleSortChange
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Remove the old sortedHotels and filteredHotelsMemo as they're no longer needed
  // Instead, use filteredHotels directly in your render method

  const handleShowOnMap = (hotel) => {
    setSelectedHotel(hotel);
    setShowMapModal(true);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setSelectedHotel(null);
  };

  const handleHeartClick = async (hotel) => {
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

      // Ensure image is a string, not an array
      const imageUrl = Array.isArray(hotel.image)
        ? hotel.image[0]
        : hotel.image || "";

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
                city: name.toLowerCase(), // Use the city name from cityData
                image: imageUrl,
                rating: hotel.rating || 0,
              })
            : null,
      });

      // Add more detailed error logging
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // Log or use the response data to remove the eslint warning
      const responseData = await response.json();
      console.log("Favorite operation response:", responseData);

      setSavedProperties((prev) => {
        const newSavedProperties = { ...prev };
        if (method === "DELETE") {
          delete newSavedProperties[hotel.id];
        } else {
          newSavedProperties[hotel.id] = {
            ...hotel,
            city: name.toLowerCase(),
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
          ? `${hotel.name} removed from favorites`
          : `${hotel.name} added to favorites`
      );
    } catch (error) {
      console.error("Detailed Error updating favorites:", error);
      toast.error(`Failed to update favorites: ${error.message}`);
    }
  };

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  // Use useMemo for filtered hotels
  const filteredHotelsMemo = useMemo(() => {
    if (!searchTerm.trim()) return allHotels;
    return allHotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allHotels, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {name} with {allHotels.length} properties
          </h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              Search
            </button>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div className={styles.map}>
              <MapContainer
                center={[referencePoint.lat, referencePoint.lon]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {allHotels.map((hotel) => {
                  const distance = getDistance(
                    referencePoint.lat,
                    referencePoint.lon,
                    hotel.coords[0],
                    hotel.coords[1]
                  ).toFixed(2);

                  return (
                    <Marker position={hotel.coords} key={hotel.id}>
                      <Popup>
                        <div>
                          <h3>{hotel.name}</h3>
                          <p>{hotel.location}</p>
                          <p>{`Distance from ${centerName}: ${distance} km`}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            <div className={styles.filters}>
              <h3 className={styles.filterTitle}>Filters</h3>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filter.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [0, +e.target.value])
                  }
                  className={styles.filterInput}
                />
                <span>{`NPR ${filter.priceRange[0]} - NPR ${filter.priceRange[1]}`}</span>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Max Distance (km)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filter.maxDistance}
                  onChange={(e) =>
                    handleFilterChange("maxDistance", +e.target.value)
                  }
                  className={styles.filterInput}
                />
                <span>{`Up to ${filter.maxDistance} km`}</span>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Minimum Rating</label>
                <select
                  value={filter.rating}
                  onChange={(e) =>
                    handleFilterChange("rating", +e.target.value)
                  }
                  className={styles.filterSelect}
                >
                  <option value="0">All</option>
                  <option value="3">3 Stars & Above</option>
                  <option value="4">4 Stars & Above</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">None</option>
                  <option value="recommended">Recommended</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Amenities</label>
                <div className={styles.amenitiesCheckboxes}>
                  {[
                    "5-Star Luxury",
                    "Multiple Restaurants",
                    "Spa",
                    "Pool",
                    "Tennis Court",
                    "Heritage Property",
                    "Luxury Spa",
                    "Cultural Tours",
                    "Fine Dining",
                    "Casino",
                    "Business Center",
                    "Modern Design",
                    "Rooftop Bar",
                    "Gym",
                    "Meeting Rooms",
                    "Garden",
                    "Restaurant",
                    "Executive Lounge",
                    "Coffee Shop",
                    "Bar",
                    "Conference Facilities",
                    "Lake View",
                    "Private Beach",
                    "Boat Service",
                    "Mountain Views"
                  ].map((amenity) => (
                    <div key={amenity} className={styles.amenityCheckbox}>
                      <input
                        type="checkbox"
                        id={amenity}
                        value={amenity}
                        checked={filter.amenities.includes(amenity)}
                        onChange={(e) => {
                          const selectedOptions = e.target.checked
                            ? [...filter.amenities, amenity]
                            : filter.amenities.filter((a) => a !== amenity);
                          handleFilterChange("amenities", selectedOptions);
                        }}
                      />
                      <label htmlFor={amenity}>
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.hotelsList}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <>
                {filteredHotelsMemo.length > 0 ? (
                  sortedHotels.map((hotel) => {
                    const distance = getDistance(
                      referencePoint.lat,
                      referencePoint.lon,
                      hotel.coords[0],
                      hotel.coords[1]
                    ).toFixed(2);
                    const isSaved = savedProperties[hotel.id] !== undefined;

                    return (
                      <div key={hotel.id} className={styles.hotelCard}>
                        <div className={styles.imageContainer}>
                          <img
                            src={
                              Array.isArray(hotel.image)
                                ? hotel.image[0]
                                : hotel.image
                            }
                            alt={hotel.name}
                            className={styles.hotelImage}
                          />
                          <div
                            className={styles.savedIcon}
                            onClick={() => handleHeartClick(hotel)}
                          >
                            <FaHeart
                              className={`${styles.heartIcon} ${
                                isSaved ? styles.saved : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div className={styles.hotelInfo}>
                          <h3 className={styles.hotelName}>{hotel.name}</h3>
                          <p className={styles.hotelLocation}>
                            {hotel.location}
                          </p>
                          <p className={styles.hotelPrice}>
                            NPR {hotel.price} per night
                          </p>
                          <p className={styles.hotelRating}>
                            Rating: <span>{hotel.rating} ★</span>
                          </p>
                          <p className={styles.hotelAmenities}>
                            {hotel.amenities?.join(", ")}
                          </p>
                          <p className={styles.hotelDistance}>
                            Distance from {centerName}: {distance} km
                          </p>
                          <div className={styles.hotelReviews}>
                            <p>{hotel.reviews?.length || 0} reviews</p>
                          </div>
                          <Link
                            to={`/hotel-details/${name.toLowerCase()}/${
                              hotel.id
                            }`}
                            className={styles.hotelButton}
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleShowOnMap(hotel)}
                            className={styles.showOnMapButton}
                          >
                            Show on Map
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noResults}>
                    No hotels found matching "{searchTerm}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {showMapModal && selectedHotel && (
          <div className={styles.mapModal}>
            <div className={styles.mapModalContent}>
              <span className={styles.close} onClick={closeMapModal}>
                &times;
              </span>
              <div className={styles.mapContainer}>
                <MapContainer
                  center={selectedHotel.coords}
                  zoom={15}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={selectedHotel.coords}>
                    <Popup>
                      <h3>{selectedHotel.name}</h3>
                      <p>{selectedHotel.location}</p>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityTemplate;