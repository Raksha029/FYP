import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import Profile from "./Components/Profile/Profile";
import LoyaltyPoints from "./Components/LoyaltyPoints/LoyaltyPoints";
import Admin from "./Admin/Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard/AdminDashboard";
import AdminLayout from "./Admin/AdminLayout/AdminLayout";
import AdminUser from "./Admin/AdminUser/AdminUser";
import AdminHotel from "./Admin/AdminHotel/AdminHotel";
import AdminRoom from "./Admin/AdminRoom/AdminRoom";
import AdminBooking from "./Admin/AdminBooking/AdminBooking";
import ProtectedRoute from './Components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';
import './i18n'; // Add this line
import { NotificationProvider } from './context/NotificationContext';
import { CurrencyProvider } from "./context/CurrencyContext";
import PaymentVerification from './Components/Payment/PaymentVerification';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [, setCurrentUser] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [savedProperties, setSavedProperties] = useState({});

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isLoggedIn) {
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
            // Save to localStorage for persistence
            localStorage.setItem(
              "savedProperties",
              JSON.stringify(favoritesMap)
            );
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      }
    };

    fetchFavorites();
  }, [isLoggedIn]);

  // Logout handler to clear current user
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  };

  return (
    <Router>
      <NotificationProvider>
      <LanguageProvider>
      <CurrencyProvider>
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
        </CurrencyProvider>
      </LanguageProvider>
      </NotificationProvider>
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
      {!isAdminRoute && (
        <Header
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <LandingPage savedProperties={savedProperties} setSavedProperties={setSavedProperties} />
            </>
          } />
          
          {/* Protected Routes */}
          <Route path="/payment/verify" element={
            <ProtectedRoute>
              <PaymentVerification />
            </ProtectedRoute>
          } />

          

          {/* City Routes */}
          <Route path="/kathmandu" element={<Kathmandu savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/pokhara" element={<Pokhara savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/baktapur" element={<Baktapur savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/lalitpur" element={<Lalitpur savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/lumbini" element={<Lumbini savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/janakpur" element={<Janakpur savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/nagarkot" element={<Nagarkot savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/dharan" element={<Dharan savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          
          {/* Hotel Details Route */}
          <Route path="/hotel-details/:city/:id" element={<HotelDetails savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          
          {/* Protected Routes */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notification notifications={notifications} onClose={handleClose} />
            </ProtectedRoute>
          } />
          <Route path="/reservation" element={
            <ProtectedRoute>
              <Reservation />
            </ProtectedRoute>
          } />
          <Route path="/favourites" element={
            <ProtectedRoute>
              <Favourites savedProperties={savedProperties} setSavedProperties={setSavedProperties} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/loyalty-points" element={
            <ProtectedRoute>
              <LoyaltyPoints />
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notifications" element={<Notification notifications={notifications} onClose={handleClose} />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/favourites" element={<Favourites savedProperties={savedProperties} setSavedProperties={setSavedProperties} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/loyalty-points" element={<LoyaltyPoints />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="hotels" element={<AdminHotel />} />
            <Route path="rooms" element={<AdminRoom />} />
            <Route path="booking" element={<AdminBooking />} />
          </Route>
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;