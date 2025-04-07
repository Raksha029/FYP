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
            <h2>Welcome to HeavenHub</h2>
            <p>Your gateway to the best hotels and exclusive experiences.</p>
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