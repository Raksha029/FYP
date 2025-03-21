import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./SearchResults.module.css";

const SearchResults = ({ savedProperties, setSavedProperties }) => {
  const location = useLocation();
  const [availableHotels, setAvailableHotels] = useState([]);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    if (location.state?.availableHotels) {
      setAvailableHotels(location.state.availableHotels);
      setSearchParams(location.state.searchParams);
    }
  }, [location.state]);

  return (
    <div className={styles.searchResultsContainer}>
      <h2>
        Search Results for {searchParams?.location}({availableHotels.length}{" "}
        hotels available)
      </h2>

      <div className={styles.hotelsGrid}>
        {availableHotels.map((hotel) => (
          <div key={hotel._id} className={styles.hotelCard}>
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className={styles.hotelImage}
            />
            <div className={styles.hotelDetails}>
              <h3>{hotel.name}</h3>
              <p>Location: {hotel.location}</p>
              <p>Price: ${hotel.price} per night</p>
              <p>Rating: {hotel.rating} ★</p>
              <p>Available Rooms: {hotel.availableRooms.length}</p>
              <p>Amenities: {hotel.amenities.join(", ")}</p>

              <Link
                to={`/hotel-details/${hotel._id}`}
                state={{
                  searchParams,
                  hotel,
                }}
                className={styles.viewDetailsButton}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
