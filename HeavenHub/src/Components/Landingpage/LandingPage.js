import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "./LandingPage.module.css";
import TopRatedProperties from "../TopRatedProperties/TopRatedProperties";
import PopularPlaces from "../PopularPlaces/PopularPlaces";
import Chatbot from "../Chatbot/Chatbot";
import { citiesData } from "../data/citiesData";
import { useTranslation } from 'react-i18next';
import * as stringSimilarity from 'string-similarity';

const LandingPage = ({ savedProperties, setSavedProperties }) => {
  const { t} = useTranslation();
  const [searchParams, setSearchParams] = useState({
    location: "",
    adults: 1,
    children: 0,
    rooms: 1,
  });
  
  // Add new state for suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get available cities from citiesData
  const availableCities = Object.keys(citiesData).map(city => 
    city.charAt(0).toUpperCase() + city.slice(1)
  );

  // Handle input change with suggestions
  const handleLocationInput = (e) => {
    const value = e.target.value;
    setSearchParams({
      ...searchParams,
      location: value,
    });

    if (value.trim() !== "") {
      const input = value.toLowerCase();
      // Find matches using substring or similarity
      const filteredCities = availableCities.filter(city => {
        const lowerCity = city.toLowerCase();
        return lowerCity.includes(input) || 
               stringSimilarity.compareTwoStrings(input, lowerCity) > 0.7;
      });

      // Correct similarity matching approach
      const matches = stringSimilarity.findBestMatch(input, availableCities.map(c => c.toLowerCase()));
      const bestMatches = matches.ratings
        .filter(r => r.rating > 0.3)
        .sort((a, b) => b.rating - a.rating)
        .map(r => availableCities.find(c => c.toLowerCase() === r.target));
      
      setSuggestions([...new Set([...filteredCities, ...bestMatches])]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (city) => {
    setSearchParams({
      ...searchParams,
      location: city,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  // Add authentication check function
  const checkAuth = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  };

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
          isAuthenticated: checkAuth()
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

   // Add this near your other imports
   const [currentImageIndex, setCurrentImageIndex] = useState(0);
        
   // Add this array of hotel images from Unsplash
   const hotelImages = [
     {
       url: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1470&auto=format&fit=crop",
       alt: "Luxury Hotel Suite"
     },
     {
       url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop",
       alt: "Hotel Infinity Pool"
     },
     {
       url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1349&auto=format&fit=crop",
       alt: "Modern Hotel Room"
     },
     {
       url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1470&auto=format&fit=crop",
       alt: "Luxury Hotel Exterior"
     }
   ];
   
   // Add this useEffect for auto-rotation
   useEffect(() => {
     const timer = setInterval(() => {
       setCurrentImageIndex((prevIndex) => 
         prevIndex === hotelImages.length - 1 ? 0 : prevIndex + 1
       );
     }, 5000); // Change image every 5 seconds
   
     return () => clearInterval(timer);
   }, [hotelImages.length]); // Add hotelImages.length to the dependency array


  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroImage}>
          {hotelImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={image.alt}
              className={`${styles.slideImage} ${
                index === currentImageIndex ? styles.activeImage : ''
              }`}
            />
          ))}
          <div className={styles.heroOverlay}>
          <h2>{t('welcomeMessage')}</h2>
          <p>{t('tagline')}</p>
            {/* Search Box */}
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <div className={styles.searchInputContainer}>
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchParams.location}
                    onChange={handleLocationInput}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSuggestions(true);
                    }}
                    className={styles.searchInput}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={styles.suggestionsList}>
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          className={styles.suggestionItem}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSuggestionClick(city);
                          }}
                        >
                          {t(`city.${city.toLowerCase()}`)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
    {num} {t('adult', { count: num })}
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
    {num} {t('child', { count: num })}
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
    {num} {t('room', { count: num })}
  </option>
))}
                  </select>
                </div>

                <button type="submit" className={styles.searchButton}>
                {t('searchButton')}
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
        <h3 className={styles.whyChooseUsHeading}>{t('whyChooseUs')}</h3>
        <p className={styles.whyChooseUsDescription}>
        {t('whyChooseUsDesc')}
        </p>
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⭐</div>
            <h4 className={styles.cardTitle}>{t('premiumExperience')}</h4>
            <p className={styles.cardDescription}>
              {t('premiumExperienceDesc')}
            </p>
          </div>
          <div className={styles.card}>
           <div className={styles.cardIcon}>🛏️</div>
           <h4 className={styles.cardTitle}>{t('comfortableStays')}</h4>
           <p className={styles.cardDescription}>
             {t('comfortableStaysDesc')}
             </p>
           </div>

          <div className={styles.card}>
  <div className={styles.cardIcon}>🔒</div>
  <h4 className={styles.cardTitle}>{t('secureBooking')}</h4>
  <p className={styles.cardDescription}>
    {t('secureBookingDesc')}
  </p>
</div>
          
<div className={styles.card}>
  <div className={styles.cardIcon}>📍</div>
  <h4 className={styles.cardTitle}>{t('primeLocations')}</h4>
  <p className={styles.cardDescription}>
    {t('primeLocationsDesc')}
  </p>
</div>
          <div className={styles.card}>
          <div className={styles.cardIcon}>⏰</div>
  <h4 className={styles.cardTitle}>{t('support247')}</h4>
  <p className={styles.cardDescription}>
    {t('support247Desc')}
  </p>
</div>
          <div className={styles.card}>
          <div className={styles.cardIcon}>💲</div>
  <h4 className={styles.cardTitle}>{t('priceGuarantee')}</h4>
  <p className={styles.cardDescription}>
    {t('priceGuaranteeDesc')}
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