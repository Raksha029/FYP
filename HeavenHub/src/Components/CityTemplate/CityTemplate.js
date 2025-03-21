import React, { useState } from "react";
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

const CityTemplate = ({ cityData, savedProperties, setSavedProperties }) => {
  const { name, hotels, referencePoint, centerName } = cityData;

  const [searchTerm, setSearchTerm] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [filter, setFilter] = useState({
    priceRange: [0, 5000],
    rating: 0,
    amenities: [],
    maxDistance: 100,
  });
  const [sortBy, setSortBy] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", {
      searchTerm,
      checkInDate,
      checkOutDate,
      adults,
      children,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilter({ ...filter, [key]: value });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

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

  const filteredHotels = hotels
    .filter((hotel) => hotel.name.toLowerCase().includes(searchTerm))
    .filter(
      (hotel) =>
        hotel.price >= filter.priceRange[0] &&
        hotel.price <= filter.priceRange[1]
    )
    .filter((hotel) => hotel.rating >= filter.rating);

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className={styles.pageContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {name} with {hotels.length} properties
          </h1>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for hotels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className={styles.dateInput}
            />
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className={styles.dateInput}
            />
            <input
              type="number"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              min="1"
              className={styles.guestInput}
              placeholder="Adults"
            />
            <input
              type="number"
              value={children}
              onChange={(e) => setChildren(e.target.value)}
              min="0"
              className={styles.guestInput}
              placeholder="Children"
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
                {hotels.map((hotel) => {
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
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Amenities</label>
                <div className={styles.amenitiesCheckboxes}>
                  {["wifi", "pool", "parking", "breakfast", "gym"].map(
                    (amenity) => (
                      <div key={amenity}>
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
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.hotelsList}>
            {sortedHotels.map((hotel) => {
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
                      src={hotel.image}
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
                    <p className={styles.hotelLocation}>{hotel.location}</p>
                    <p className={styles.hotelPrice}>
                      NPR {hotel.price} per night
                    </p>
                    <p className={styles.hotelRating}>
                      Rating: <span>{hotel.rating} ★</span>
                    </p>
                    <p className={styles.hotelAmenities}>
                      {hotel.amenities.join(", ")}
                    </p>
                    <p className={styles.hotelDistance}>
                      Distance from {centerName}: {distance} km
                    </p>
                    <div className={styles.hotelReviews}>
                      <p>{hotel.reviews.length} reviews</p>
                    </div>
                    <Link
                      to={`/hotel-details/${cityData.name.toLowerCase()}/${
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
            })}
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
