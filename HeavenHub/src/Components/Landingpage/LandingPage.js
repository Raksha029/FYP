import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./LandingPage.module.css";
import hotelbackground_icon from "../Assets/hotelbackground.png";
import TopRatedProperties from "../TopRatedProperties/TopRatedProperties";
import PopularPlaces from "../PopularPlaces/PopularPlaces";
import Chatbot from "../Chatbot/Chatbot";

const LandingPage = ({ savedProperties, setSavedProperties }) => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    adults: 1,
    children: 0,
    rooms: 1,
    priceRange: [0, 5000],
    amenities: [],
    rating: 0,
  });

  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const queryParams = new URLSearchParams({
        name: searchParams.location.toLowerCase(),
        adults: searchParams.adults,
        children: searchParams.children,
        rooms: searchParams.rooms,
      });

      const response = await fetch(
        `http://localhost:4000/api/cities/search?${queryParams}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to search hotels");
      }

      // Navigate to results page with the filtered data
      navigate(`/${searchParams.location.toLowerCase()}`, {
        state: {
          searchParams,
          cityData: data,
        },
      });
    } catch (error) {
      console.error("Search Error:", error);
      toast.error(error.message || "Failed to search hotels");
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
            <h2>Welcome to HeavenHub</h2>
            <p>Your gateway to the best hotels and exclusive experiences.</p>
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchFields}>
                <input
                  type="text"
                  name="location"
                  placeholder="Where would you like to stay?"
                  value={searchParams.location}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      location: e.target.value,
                    })
                  }
                  className={styles.searchInput}
                />
                <input
                  type="number"
                  name="adults"
                  value={searchParams.adults}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, adults: e.target.value })
                  }
                  min="1"
                  className={styles.searchInput}
                  placeholder="Adults"
                />
                <input
                  type="number"
                  name="children"
                  value={searchParams.children}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      children: e.target.value,
                    })
                  }
                  min="0"
                  className={styles.searchInput}
                  placeholder="Children"
                />
                <input
                  type="number"
                  name="rooms"
                  value={searchParams.rooms}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, rooms: e.target.value })
                  }
                  min="1"
                  className={styles.searchInput}
                  placeholder="Rooms"
                />
                <button type="submit" className={styles.searchButton}>
                  Search
                </button>
              </div>
            </form>
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
      <section className={styles.whyChooseUsSection}>
        <div className={styles.whyChooseUsBackground}>
          <div className={styles.textContainer}>
            <h3 className={styles.whyChooseUsHeading}>Why Choose Us?</h3>
            <p className={styles.whyChooseUsDescription}>
              Discover the reasons why HeavenHub is the best choice for your
              stay. We offer unbeatable deals, a wide selection of hotels, and
              exclusive experiences tailored to your needs.
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