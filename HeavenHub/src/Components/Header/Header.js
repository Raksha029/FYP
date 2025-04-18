import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import user icon and chat icon
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import LoginSignup from "../LoginSignup/LoginSignup";
import Language from "../Language/Language"; // Import the Language component
import Currency from "../Currency/Currency"; // Import the Currency component
import Chatbot from "../Chatbot/Chatbot"; // Import the Chatbot component

// Add userProfile state and fetch function
const Header = ({ setIsLoggedIn, isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Add this useEffect to fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:4000/api/user-profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [isLoggedIn]);

  // Modify useEffect to check localStorage more carefully
  useEffect(() => {
    // Check if user was previously logged in
    const storedLoginStatus = localStorage.getItem("isLoggedIn");

    // Only set to true if there's a specific login token or condition
    if (storedLoginStatus === "true") {
      // Additional check to verify the login is still valid
      // You might want to add a token validation here
      setIsLoggedIn(true);
    } else {
      // Ensure sign-in button is shown by default
      setIsLoggedIn(false);
    }
  }, [setIsLoggedIn]);

  const handleSignInClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleHomeClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowPopup(false);
    localStorage.setItem("isLoggedIn", "true");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    // Remove the googleLoginSuccess parameter from URL
    const newUrl = window.location.pathname;
    window.history.replaceState({}, "", newUrl);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleAboutClick = () => {
    navigate("/about");
  };

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handleNotificationClick = () => {
    navigate("/notifications"); // Navigate to the Notification page
  };

  const handleReservationClick = () => {
    navigate("/reservation"); // Navigate to the Reservation page
  };

  const handleFavouritesClick = () => {
    navigate("/favourites"); // Navigate to the Favourites page
  };

  useEffect(() => {
    // Check for the emailVerified query parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("emailVerified") === "true") {
      setShowPopup(true); // Show login popup if email is verified
    }
  }, [location]);

  useEffect(() => {
    // Check if the user has completed Google authentication and is logged in
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("googleLoginSuccess") === "true") {
      // Extract token from URL or local storage
      const token = queryParams.get("token") || localStorage.getItem("token");

      if (token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      }

      // Clean up URL by removing the parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [location, setIsLoggedIn]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg 
          className={styles.logoIcon} 
          viewBox="0 0 24 24" 
          width="40" 
          height="40"
        >
          <path 
            fill="currentColor" 
            d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3l-3-2.7zM17 18h-2v-6H9v6H7v-7.81l5-4.5 5 4.5V18z"
          />
        </svg>
        <span className={styles.logoText}>HeavenHub</span>
      </div>
      <nav className={styles.nav}>
        <button
          className={styles.navLink}
          onClick={handleHomeClick} // Use the handler to check if on the home page
        >
          Home
        </button>
        <button className={styles.navLink} onClick={handleAboutClick}>
          About Us
        </button>
        <button className={styles.navLink} onClick={handleContactClick}>
          Contact Us
        </button>
      </nav>
      <div className={styles.languageCurrencyContainer}>
        <Language /> {/* Keep the Language component here */}
        <Currency /> {/* Add the Currency component here */}
      </div>
      <div className={styles.authButtons}>
        {!isLoggedIn ? (
          <button className={styles.signInButton} onClick={handleSignInClick}>
            <FaUserCircle className={styles.icon} />
            Sign In
          </button>
        ) : (
          <div className={styles.userIconWrapper} onClick={toggleDropdown}>
            {userProfile?.profilePicture ? (
              <img 
                src={userProfile.profilePicture} 
                alt="Profile" 
                className={styles.userProfileImage}
              />
            ) : (
              <FaUserCircle className={styles.appicon} />
            )}
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={handleNotificationClick}
                >
                  Notifications
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleFavouritesClick}
                >
                  Favourites
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={handleReservationClick}
                >
                  Reservation
                </button>
                <hr className={styles.dropdownDivider} />
                <span className={styles.dropdownHeading}>Account</span>
                <button
                  className={styles.dropdownItem}
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => navigate("/loyalty-points")}
                >
                  Loyalty Points
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {showPopup && (
        <LoginSignup
          onClose={handleClosePopup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </header>
  );
};

export default Header;