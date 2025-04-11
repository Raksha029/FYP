import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./LandingPage.module.css";
import hotelbackground_icon from "../Assets/hotelbackground.png";
import TopRatedProperties from "../TopRatedProperties/TopRatedProperties";
import PopularPlaces from "../PopularPlaces/PopularPlaces";
import Chatbot from "../Chatbot/Chatbot";
import hotel1 from "../Assets/hotel1.png";
import { citiesData } from "../data/citiesData";
import '@fortawesome/fontawesome-free/css/all.min.css';

const LandingPage = ({ savedProperties, setSavedProperties }) => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    adults: 1,
    children: 0,
    rooms: 1,
  });

  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get city data from citiesData
      const cityData = citiesData[searchParams.location.toLowerCase()];

      if (!cityData) {
        toast.error("City not found!");
        return;
      }

      const totalGuests =
        parseInt(searchParams.adults) + parseInt(searchParams.children);

      // Filter hotels based on capacity requirements
      const filteredHotels = cityData.hotels.filter((hotel) => {
        // Check if any room type can accommodate the guests and required rooms
        return hotel.rooms.some((room) => {
          const roomCapacity = parseInt(room.capacity.split(" ")[0]);
          return (
            roomCapacity >= totalGuests && room.available >= searchParams.rooms
          );
        });
      });

      // Prepare the filtered city data
      const filteredCityData = {
        ...cityData,
        hotels: filteredHotels,
      };

      if (filteredHotels.length === 0) {
        toast.info("No hotels found matching your requirements");
        return;
      }

      // Navigate to city page with filtered results
      navigate(`/${searchParams.location.toLowerCase()}`, {
        state: {
          searchParams,
          cityData: filteredCityData,
        },
      });
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Failed to search hotels");
    }
  };

  const handleChatClick = () => {
    setShowChatbot((prev) => !prev);
  };

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroImage}>
          <img src={hotelbackground_icon} alt="Luxurious hotel" />
          <div className={styles.heroOverlay}>
            <h2>Perfect Stays, Just a Click Away</h2>
            <p>Your access point to premium hotels and unique getaways.</p>
            {/* Search Box */}
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Enter city name..."
                  value={searchParams.location}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      location: e.target.value,
                    })
                  }
                  className={styles.searchInput}
                />

                <div className={styles.guestInputs}>
                  <select
                    value={searchParams.adults}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        adults: parseInt(e.target.value),
                      })
                    }
                    className={styles.select}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Adult{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>

                  <select
                    value={searchParams.children}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        children: parseInt(e.target.value),
                      })
                    }
                    className={styles.select}
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Child{num !== 1 ? "ren" : ""}
                      </option>
                    ))}
                  </select>

                  <select
                    value={searchParams.rooms}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        rooms: parseInt(e.target.value),
                      })
                    }
                    className={styles.select}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Room{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Places Section */}
      <PopularPlaces />

      {/* Recommended Activities Section */}
      <TopRatedProperties
        savedProperties={savedProperties}
        setSavedProperties={setSavedProperties}
      />

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseUs}>
        <h2 className={styles.whyChooseUsHeading}>Why Choose HeavenHub?</h2>
        <p className={styles.whyChooseUsSubheading}>
          We offer the best selection of hotels with unmatched service and value.
        </p>
        <div className={styles.whyChooseUsCards}>
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <i className="fas fa-bed"></i> {/* Font Awesome Bed Icon */}
            </div>
            <h3>Comfort Guaranteed</h3>
            <p>
              Handpicked accommodations that meet our high standards of comfort.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <i className="fas fa-award"></i> {/* Font Awesome Award Icon */}
            </div>
            <h3>Quality Selection</h3>
            <p>
              Every hotel is personally vetted for quality and service excellence.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <i className="fas fa-clock"></i> {/* Font Awesome Clock Icon */}
            </div>
            <h3>24/7 Support</h3>
            <p>
              Our customer support team is available 24/7 for any assistance.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              <i className="fas fa-check-circle"></i> {/* Font Awesome Check Icon */}
            </div>
            <h3>Best Price Promise</h3>
            <p>
              We guarantee competitive rates with no hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Floating chat icon */}
      <div className={styles.floatingChatIcon} onClick={handleChatClick}>
        <FaComments className={styles.chatIconStyle} />
      </div>

      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
};

export default LandingPage;