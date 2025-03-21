import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./Components/Landingpage/LandingPage";
import ForgotPassword from "./Components/ForgotPassword/Forgotpassword";
import ChangePassword from "./Components/ChangePassword.js/ChangePassword";
import Kathmandu from "./Components/Kathmandu/Kathmandu";
import Pokhara from "./Components/Pokhara/Pokhara";
import Baktapur from "./Components/Baktapur/Baktapur";
import Lalitpur from "./Components/Lalitpur/Lalitpur";
import Lumbini from "./Components/Lumbini/Lumbini";
import Janakpur from "./Components/Janakpur/Janakpur";
import Nagarkot from "./Components/Nagarkot/Nagarkot";
import Dharan from "./Components/Dharan/Dharan";
import HotelDetails from "./Components/HotelDetails/HotelDetails";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Notification from "./Components/Notification/Notification";
import Reservation from "./Components/Reservation/Reservation";
import Favourites from "./Components/Favourites/Favourites";
import TopRatedProperties from "./Components/TopRatedProperties/TopRatedProperties";
import Profile from "./Components/Profile/Profile";
import LoyaltyPoints from "./Components/LoyaltyPoints/LoyaltyPoints";
import SearchResults from "./Components/SearchResults/SearchResults";
import Admin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { message: "Successfully booking", date: "12 Mar 2021" },
    { message: "Shared successfully", date: "12 Mar 2021" },
    { message: "Get discount offer", date: "12 Mar 2021" },
  ]);
  const [savedProperties, setSavedProperties] = useState(() => {
    const currentUser = JSON.parse(localStorage.getItem("userData"));
    if (currentUser) {
      const savedPropertiesFromStorage = JSON.parse(
        localStorage.getItem(`favorites_${currentUser.id}`) || "{}"
      );
      return savedPropertiesFromStorage;
    }
    return {};
  });

  const handleClose = (index) => {
    const newNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(newNotifications);
  };

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (loggedInStatus && userData) {
      setIsLoggedIn(true);
      setCurrentUser(userData);
    }
  }, []);

  // Load user-specific favorites from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      if (currentUser && isLoggedIn) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:4000/api/favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const favoriteProperties = await response.json();

            const favoritesMap = favoriteProperties.reduce((acc, prop) => {
              acc[prop.propertyId] = {
                ...prop,
                isFavorite: true,
              };
              return acc;
            }, {});

            setSavedProperties(favoritesMap);
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      }
    };

    fetchFavorites();
  }, [currentUser, isLoggedIn]);

  // Additional effect to save favorites to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `favorites_${currentUser.id}`,
        JSON.stringify(savedProperties)
      );
    }
  }, [savedProperties, currentUser]);

  // Logout handler to clear current user
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  };

  return (
    <Router>
      <Content
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        handleLogout={handleLogout}
        savedProperties={savedProperties}
        setSavedProperties={setSavedProperties}
        notifications={notifications}
        handleClose={handleClose}
      />
      <ToastContainer />
    </Router>
  );
};

const Content = ({
  isLoggedIn,
  setIsLoggedIn,
  handleLogout,
  savedProperties,
  setSavedProperties,
  notifications,
  handleClose,
}) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute && (
        <Header
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/kathmandu"
            element={
              <Kathmandu
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/pokhara"
            element={
              <Pokhara
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/baktapur"
            element={
              <Baktapur
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/lalitpur"
            element={
              <Lalitpur
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/lumbini"
            element={
              <Lumbini
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/janakpur"
            element={
              <Janakpur
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/nagarkot"
            element={
              <Nagarkot
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/dharan"
            element={
              <Dharan
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/hotel-details/:city/:id"
            element={
              <HotelDetails
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/notifications"
            element={
              <Notification
                notifications={notifications}
                onClose={handleClose}
              />
            }
          />
          <Route path="/reservation" element={<Reservation />} />
          <Route
            path="/favourites"
            element={
              <Favourites
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route
            path="/"
            element={
              <TopRatedProperties
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loyalty-points" element={<LoyaltyPoints />} />
          <Route
            path="/search-results"
            element={
              <SearchResults
                savedProperties={savedProperties}
                setSavedProperties={setSavedProperties}
              />
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      {isAdminRoute && <Footer />}
    </>
  );
};

export default App;
