import React, { useState, useEffect } from "react";
import styles from "./Reserve.module.css";
import KhaltiCheckout from "khalti-checkout-web"; // Import Khalti SDK

const Reserve = ({ userDetails, setUserDetails, setShowReservationForm }) => {
  const [selectedCountry, setSelectedCountry] = useState(null); // Initialize selectedCountry after fetching countries
  const [countryOptions, setCountryOptions] = useState([]); // State for country options
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [filteredCountries, setFilteredCountries] = useState([]); // State for filtered countries

  useEffect(() => {
    // Fetch countries from API
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
      setSelectedCountry(formattedCountries[0]); // Set default selected country
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value })); // Update user details
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setUserDetails((prev) => ({ ...prev, country: country.name })); // Update country in user details
    setShowDropdown(false); // Close dropdown after selection
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = countryOptions.filter((country) =>
      country.name.toLowerCase().includes(searchValue)
    );
    setFilteredCountries(filtered);
  };

  // Khalti Payment Config
  const khaltiConfig = {
    publicKey: "your_public_key_here", // Replace with your Khalti Public Key
    productIdentity: "1234567890",
    productName: "Hotel Booking",
    productUrl: "http://localhost:3000",
    eventHandler: {
      onSuccess(payload) {
        console.log("Payment Successful", payload);
        alert("Khalti Payment successful! Booking confirmed.");
      },
      onError(error) {
        console.log("Payment Error", error);
        alert("Khalti Payment failed. Try again.");
      },
      onClose() {
        console.log("Payment closed.");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const khaltiCheckout = new KhaltiCheckout(khaltiConfig);

  const handleKhaltiPayment = () => {
    khaltiCheckout.show({ amount: 1000 }); // Amount in Paisa (1000 = Rs.10)
  };

  // eSewa Payment Function
  const handleEsewaPayment = () => {
    const amount = 10; // Rs.10
    const url = `https://esewa.com.np/epay/main?amt=${amount}&psc=0&pdc=0&txAmt=0&tAmt=${amount}&pid=1234567890&scd=your_esewa_merchant_id&su=http://localhost:3000/payment-success&fu=http://localhost:3000/payment-failed`;
    window.location.href = url;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (userDetails?.paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else if (userDetails?.paymentMethod === "esewa") {
      handleEsewaPayment();
    } else {
      alert("Please select a payment method.");
    }
  };

  return (
    <div className={styles.reservationForm}>
      <h2>Enter your details</h2>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={userDetails.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={userDetails.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={userDetails.email}
          onChange={handleInputChange}
          required
        />
        <div className={styles.countrySelector}>
          <div
            className={styles.dropdownToggle}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={selectedCountry?.flag || "https://via.placeholder.com/24"}
              alt="Selected Flag"
              className={styles.flagIconSmall}
            />
            <span>{selectedCountry?.name}</span>
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
                    onClick={() => handleCountryChange(country)}
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
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={userDetails.phone}
          onChange={handleInputChange}
          required
          style={{ marginTop: "15px" }}
        />
        {/* Payment Method */}
        <div>
          <label>Payment Method:</label>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Khalti"
                checked={userDetails?.paymentMethod === "Khalti"}
                onChange={handleInputChange}
              />
              Khalti
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="esewa"
                checked={userDetails?.paymentMethod === "esewa"}
                onChange={handleInputChange}
              />
              eSewa
            </label>
          </div>
        </div>
        <div>
          <label>Who are you booking for? (optional)</label>
          <div>
            <label>
              <input
                type="radio"
                name="bookingFor"
                value="mainGuest"
                checked={userDetails.bookingFor === "mainGuest"}
                onChange={handleInputChange}
              />
              I'm the main guest
            </label>
            <label>
              <input
                type="radio"
                name="bookingFor"
                value="someoneElse"
                checked={userDetails.bookingFor === "someoneElse"}
                onChange={handleInputChange}
              />
              I'm booking for someone else
            </label>
          </div>
        </div>
        <div>
          <label>Are you traveling for work? (optional)</label>
          <div>
            <label>
              <input
                type="radio"
                name="travelingForWork"
                value="yes"
                onChange={handleInputChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="travelingForWork"
                value="no"
                onChange={handleInputChange}
              />
              No
            </label>
          </div>
        </div>
        <button type="submit">Confirm Reservation</button>
        <button
          type="button"
          onClick={() => setShowReservationForm(false)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Reserve;
