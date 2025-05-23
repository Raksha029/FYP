import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";

import styles from "./CityTemplate.module.css";
import L from "leaflet";
import { FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import { useCurrency } from '../../context/CurrencyContext';

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
  const { t, i18n } = useTranslation();
  const { addNotification } = useNotification();
  // Add currency context
  const { currency, convertPrice } = useCurrency();
  const { name, referencePoint } = cityData; // Remove centerName from destructuring
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
        toast.error(t('loginToFavorite'));
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
          addNotification({
            type: 'favorite',
            messageKey:'removedFromFavorites1',
            messageParams: {
              hotelName: hotel.name
            },
            message: t('removedFromFavorites1', {
              hotelName: t(`hotel.${hotel.name}`) || hotel.name
            }),
            time: new Date().toLocaleTimeString()
          });
        } else {
          newSavedProperties[hotel.id] = {
            ...hotel,
            city: name.toLowerCase(),
            isFavorite: true,
          };
          addNotification({
            type: 'favorite',
            messageKey:'addedToFavorites1',
            messageParams: {
              hotelName: hotel.name
            },
            message: t('addedToFavorites1', {
              hotelName: t(`hotel.${hotel.name}`) || hotel.name
            }),
            time: new Date().toLocaleTimeString()
          });
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
          ? t('removedFromFavorites', { hotelName: t(`hotel.${hotel.name}`) })
          : t('addedToFavorites', { hotelName: t(`hotel.${hotel.name}`) })
      );
    } catch (error) {
      console.error("Detailed Error updating favorites:", error);
      toast.error(t('failedToUpdateFavorites'));
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
          {t('cityHotelsHeader', { 
    name: t(`city.${name.toLowerCase()}`), // Add .toLowerCase()
    count: allHotels.length 
  })}
          </h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={t('searchHotelsPlaceholder')}

              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
            {t('searchButton')}
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
                        <h3>{t(`hotel.${hotel.name}`)}</h3>
                        <p>{t(`location.${hotel.location}`)}</p>
                        <p>{t('distanceFrom', { 
                             centerName: t(`location.${hotel.location}`),
                              distance: new Intl.NumberFormat(i18n.language).format(distance)
                         })}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
            <div className={styles.filters}>
              <h3 className={styles.filterTitle}>{t('filters')}</h3>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t('priceRange')}</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filter.priceRange[1]}
                  onChange={(e) => handleFilterChange("priceRange", [0, +e.target.value])}
                  className={styles.filterInput}
                />
                <span>{t('priceRangeDisplay', { 
                  min: filter.priceRange[0], 
                  max: filter.priceRange[1] 
                })}</span>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t('maxDistance')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filter.maxDistance}
                  onChange={(e) => handleFilterChange("maxDistance", +e.target.value)}
                  className={styles.filterInput}
                />
                <span>{t('maxDistanceDisplay', { distance: filter.maxDistance })}</span>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t('minimumRating')}</label>
                <select
                  value={filter.rating}
                  onChange={(e) => handleFilterChange("rating", +e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="0">{t('all')}</option>
                  <option value="3">{t('rating3Plus')}</option>
                  <option value="4">{t('rating4Plus')}</option>
                  <option value="5">{t('rating5')}</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t('sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">{t('none')}</option>
                  <option value="price">{t('priceLowToHigh')}</option>
                  <option value="rating">{t('ratingHighToLow')}</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t('amenities1')}</label>
                <div className={styles.amenitiesCheckboxes}>
                  {Object.keys(t('amenities', { returnObjects: true })).map((key) => (
                    <div key={key} className={styles.amenityCheckbox}>
                      <input
                        type="checkbox"
                        id={key}
                        value={key}
                        checked={filter.amenities.includes(key)}
                        onChange={(e) => {
                          const selectedOptions = e.target.checked
                            ? [...filter.amenities, key]
                            : filter.amenities.filter(a => a !== key);
                          handleFilterChange("amenities", selectedOptions);
                        }}
                      />
                      <label htmlFor={key}>{t(`amenities.${key}`)}</label>
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
                          <h3 className={styles.hotelName}>{t(`hotel.${hotel.name}`)}</h3>
                          <p className={styles.hotelLocation}>{t(`location.${hotel.location}`)}</p>
                          <p className={styles.hotelPrice}>
                            {currency.symbol} {convertPrice(hotel.price)} {t('perNight')}
                          </p>
                          <p className={styles.hotelRating}>
                            {t('rating')}: <span>{new Intl.NumberFormat(i18n.language).format(hotel.rating)} ★</span>
                          </p>
                          <p className={styles.hotelAmenities}>
                            {hotel.amenities?.map(amenity => t(`amenities.${amenity}`)).join(", ")}
                          </p>
                          <p className={styles.hotelDistance}>
                            {t('distanceFrom', { 
                              centerName: t(`location.${hotel.location}`),
                              distance: new Intl.NumberFormat(i18n.language).format(distance)
                            })}</p>
                          <div className={styles.hotelReviews}>
                            <p>{t('reviews', { count: hotel.reviews?.length || 0 })}</p>
                          </div>
                          <Link
                            to={`/hotel-details/${name.toLowerCase()}/${hotel.id}`}
                            className={styles.hotelButton}
                          >
                            {t('viewDetails')}
                          </Link>
                          <button
                            onClick={() => handleShowOnMap(hotel)}
                            className={styles.showOnMapButton}
                          >
                            {t('showOnMap')}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noResults}>
                      {t('noHotelsFound', { searchTerm: searchTerm })}
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
                      <h3>{t(`hotel.${selectedHotel.name}`)}</h3>
                      <p>{t(`location.${selectedHotel.location}`)}</p>
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