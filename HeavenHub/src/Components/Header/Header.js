import React, { useState, useEffect } from "react";
import { FaUserCircle, FaHotel } from "react-icons/fa"; // Add FaHotel icon
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import LoginSignup from "../LoginSignup/LoginSignup";
import Language from "../Language/Language";
import Currency from "../Currency/Currency";
import Chatbot from "../Chatbot/Chatbot";
import { useTranslation } from 'react-i18next';

// Remove the logo import and replace the img tag with this in the return statement:
const Header = ({ setIsLoggedIn, isLoggedIn }) => {
  const { t } = useTranslation();
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
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false);
    setShowDropdown(false);
    window.location.href = '/'; // Force page refresh and redirect to landing page
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
      <div className={styles.logoContainer}>
        <FaHotel className={styles.logoIcon} />
        <span className={styles.logoText}>HeavenHub</span>
      </div>
      <nav className={styles.nav}>
        <button
          className={styles.navLink}
          onClick={handleHomeClick}
        >
          {t('home')}
        </button>
        <button className={styles.navLink} onClick={handleAboutClick}>
          {t('about')}
        </button>
        <button className={styles.navLink} onClick={handleContactClick}>
          {t('contact')}
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
             {t('signIn')}
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
                <button className={styles.dropdownItem} onClick={handleNotificationClick}>
                  {t('notifications')}
                </button>
                <button className={styles.dropdownItem} onClick={handleFavouritesClick}>
                  {t('favourites')}
                </button>
                <button className={styles.dropdownItem} onClick={handleReservationClick}>
                  {t('reservation')}
                </button>
                <hr className={styles.dropdownDivider} />
                <span className={styles.dropdownHeading}>{t('account')}</span>
                <button className={styles.dropdownItem} onClick={() => navigate("/profile")}>
                  {t('viewProfile')}
                </button>
                <button className={styles.dropdownItem} onClick={() => navigate("/loyalty-points")}>
                  {t('loyaltyPoints')}
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  {t('logout')}
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