import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa"; // Import necessary icons
import { useNavigate } from "react-router-dom";
import styles from "./LoginSignup.module.css"; // Import CSS for styling
import google from "../Assets/google.png";

const LoginSignup = ({ onClose, onLoginSuccess }) => {
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
        alert("Passwords do not match!");
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
      setError("Please enter a valid email address.");
      return;
    }

    if (!isLogin) {
      // Password strength validation
      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordPattern.test(formData.password)) {
        setError(
          "Password must be at least 8 characters long and contain at least one letter and one number."
        );
        return;
      }

      // Mobile number validation
      const mobilePattern = /^\d{10}$/;
      if (!mobilePattern.test(formData.mobileNumber)) {
        setError("Mobile number must be exactly 10 digits.");
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
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleFormSubmit} className={styles.form}>
          {!isLogin && (
            <>
              <div className={styles.nameFields}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.icon} />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <div className={styles.inputWrapper}>
                    <FaUser className={styles.icon} />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <CountrySelector formData={formData} setFormData={setFormData} />
              <div className={styles.inputGroup}>
                <label htmlFor="mobileNumber">Mobile Number</label>
                <div className={styles.inputWrapper}>
                  <FaPhone className={styles.icon} />
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Enter your mobile number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.icon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
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
                Forgot Password?
              </Link>
            </p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            {isLogin ? "Login" : "Register"}
          </button>
          {isLogin && (
            <div className={styles.thirdParty}>
              <div className={styles.divider}>
                <span className={styles.googleText}>Sign up with</span>
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
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className={styles.toggleLink} onClick={handleToggle}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

const CountrySelector = ({ formData, setFormData }) => {
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
          alt="Selected Flag"
          className={styles.flagIcon}
        />
        <span>{formData.country || "Nepal"}</span>{" "}
        {/* Default country is Nepal */}
      </div>
      {showDropdown && (
        <div className={styles.dropdownMenu}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a country"
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
