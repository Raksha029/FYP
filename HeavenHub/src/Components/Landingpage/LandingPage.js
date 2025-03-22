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

const LandingPage = ({ savedProperties, setSavedProperties }) => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    rooms: 1,
  });

  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    // Add comprehensive logging
    console.log("Search Parameters:", {
      location: searchParams.location,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      adults: searchParams.adults,
      children: searchParams.children,
      rooms: searchParams.rooms,
    });

    // Validate dates
    const checkIn = new Date(searchParams.checkIn);
    const checkOut = new Date(searchParams.checkOut);

    if (checkIn >= checkOut) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/search-hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...searchParams,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        }),
      });

      // Log raw response
      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      // Parse JSON after logging
      const data = JSON.parse(responseText);

      if (data.length > 0) {
        navigate("/search-results", {
          state: {
            searchParams,
            availableHotels: data,
          },
        });
      } else {
        toast.info("No hotels available for selected parameters");
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Search failed. Please try again.");
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
                  type="date"
                  name="checkIn"
                  value={searchParams.checkIn}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      checkIn: e.target.value,
                    })
                  }
                  className={styles.searchInput}
                />
                <input
                  type="date"
                  name="checkOut"
                  value={searchParams.checkOut}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      checkOut: e.target.value,
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
  <div className={styles.whyChooseUsContainer}>
    {/* Image on the Left */}
    <div className={styles.whyChooseUsImage}>
      <img src={hotel1} alt="Why Choose Us" />
    </div>

    {/* Text on the Right */}
    <div className={styles.textContainer}>
      <h3 className={styles.whyChooseUsHeading}>Why Choose Us?</h3>
      <p className={styles.whyChooseUsDescription}>
        Discover why HeavenHub is your perfect choice. We offer unbeatable 
        deals, a vast selection of hotels, and exclusive experiences tailored 
        to your needs. Enjoy seamless booking, 24/7 support, and personalized 
        recommendations for a memorable stay.
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
