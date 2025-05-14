import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa"; // Import necessary icons
import { useNavigate } from "react-router-dom";
import styles from "./LoginSignup.module.css"; // Import CSS for styling
import google from "../Assets/google.png";
import { useTranslation } from 'react-i18next'; 
import { useNotification } from '../../context/NotificationContext';

const LoginSignup = ({ onClose, onLoginSuccess }) => {
  const { addNotification } = useNotification();
  const {t} = useTranslation();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Nepal",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Memoize onLoginSuccess to prevent unnecessary re-renders
  const memoizedOnLoginSuccess = useCallback(() => {
    onLoginSuccess();
  }, [onLoginSuccess]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast.error(t('passwordsDoNotMatch'));
        return false;
      }
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError(t('enterValidEmail'));
      return;
    }

    if (!isLogin) {
      // Password strength validation
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordPattern.test(formData.password)) {
        setError(t('passwordRequirements'));
        return;
      }

      // Mobile number validation
      const mobilePattern = /^\d{10}$/;
      if (!mobilePattern.test(formData.mobileNumber)) {
        setError(t('mobileNumberRequirements'));
        return;
      }
    }

    if (!validateForm()) return;

    const url = isLogin
      ? "http://localhost:4000/login"
      : "http://localhost:4000/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);

        if (isLogin) {
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isLoggedIn", "true");

            if (data.user) {
              localStorage.setItem(
                "userData",
                JSON.stringify({
                  id: data.user.id,
                  email: data.user.email,
                  firstName: data.user.firstName,
                })
              );
              addNotification({
                type: 'login',
                messageKey: 'loginSuccess',
                messageParams: { 
                  firstName: data.user.firstName  },
                  message: t('loginSuccess', { 
                    firstName: data.user.firstName 
                  }),
                  time: new Date().toLocaleTimeString()
              });
            }
          }

          memoizedOnLoginSuccess();
        }

        navigate("/");
      } else {
        toast.error(data.error || "An error occurred");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleForgotPasswordClick = () => {
    onClose(); // Close the login popup
    navigate("/forgot-password"); // Navigate to the forgot password page
  };

  useEffect(() => {
    // Check for token in URL after Google authentication
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store token and mark as logged in
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");

      // Optional: Clear the token from URL
      window.history.replaceState({}, "", window.location.pathname);

      // Trigger login success
      memoizedOnLoginSuccess();
      navigate("/");
    }
  }, [navigate, memoizedOnLoginSuccess]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{isLogin ? t('login') : t('register')}</h2>
        <form onSubmit={handleFormSubmit} className={styles.form}>
          {!isLogin && (
            <>
              <div className={styles.nameFields}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">{t('firstName')}</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.icon} />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder={t('enterFirstName')}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                <label htmlFor="lastName">{t('lastName')}</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.icon} />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder={t('enterLastName')}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <CountrySelector formData={formData} setFormData={setFormData} />
              <div className={styles.inputGroup}>
                <label htmlFor="mobileNumber">{t('mobileNumber')}</label>
                <div className={styles.inputWrapper}>
                  <FaPhone className={styles.icon} />
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder={t('enterMobileNumber')}
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="email">{t('email')}</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t('enterEmail')}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">{t('password')}</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder={t('enterPassword')}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.icon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder={t('enterConfirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}
          {isLogin && (
            <p className={styles.forgotPassword}>
              <Link
                to="/forgot-password"
                className={styles.forgotPasswordLink}
                onClick={handleForgotPasswordClick}
              >
                {t('forgotPassword')}
              </Link>
            </p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            {isLogin ? t('login') : t('register')}
          </button>
          {isLogin && (
            <div className={styles.thirdParty}>
              <div className={styles.divider}>
                <span className={styles.googleText}>{t('signUpWith')}</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className={styles.googleButton}
              >
                <img src={google} alt="Google" className={styles.googleIcon} />
              </button>
            </div>
          )}
        </form>
        <p className={styles.toggleText}>
          {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{" "}
          <span className={styles.toggleLink} onClick={handleToggle}>
            {isLogin ? t('register') : t('login')}
          </span>
        </p>
      </div>
    </div>
  );
};

const CountrySelector = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const [countryOptions, setCountryOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
      );
      const countries = await response.json();
      const formattedCountries = countries.map((country) => ({
        name: country.name.common,
        flag: country.flags.png,
        code: country.cca2,
      }));
      setCountryOptions(formattedCountries);
      setFilteredCountries(formattedCountries);
    };
    fetchCountries();
  }, []);

  // Set default country to Nepal
  const defaultCountry = countryOptions.find(
    (country) => country.name === "Nepal"
  );

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({
      ...prev,
      country: country.name,
    }));
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = countryOptions.filter((country) =>
      country.name.toLowerCase().includes(searchValue)
    );
    setFilteredCountries(filtered);
  };

  return (
    <div className={styles.countrySelector}>
      <div
        className={styles.dropdownToggle}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img
          src={
            (formData.country &&
              countryOptions.find((c) => c.name === formData.country)?.flag) ||
            (defaultCountry
              ? defaultCountry.flag
              : "https://via.placeholder.com/24")
          }
          alt={t('selectedFlag')}
          className={styles.flagIcon}
        />
        <span>{formData.country || t('nepal')}</span>
      </div>
      {showDropdown && (
        <div className={styles.dropdownMenu}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('searchCountry')}
            onChange={handleSearch}
          />
          <ul className={styles.dropdownList}>
            {filteredCountries.map((country) => (
              <li
                key={country.code}
                className={styles.dropdownItem}
                onClick={() => handleCountrySelect(country)}
              >
                <img
                  src={country.flag}
                  alt={country.name}
                  className={styles.flagIconSmall}
                />
                <span>{country.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;