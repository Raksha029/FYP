import React, { useState, useEffect } from "react";
import styles from "./Reserve.module.css";
import { toast } from "react-toastify";

const Reserve = ({ userDetails, setUserDetails, onClose, selectedRoom, onBookingComplete }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date and tomorrow's date for default values
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format dates for input field default values
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      setSelectedCountry(formattedCountries[0]);
    };
    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setUserDetails((prev) => ({ ...prev, country: country.name }));
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filtered = countryOptions.filter((country) =>
      country.name.toLowerCase().includes(searchValue)
    );
    setFilteredCountries(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to complete your booking");
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      if (!userDetails.checkInDate || !userDetails.checkOutDate) {
        toast.error("Please select check-in and check-out dates");
        setIsSubmitting(false);
        return;
      }

      const bookingData = {
        hotelId: selectedRoom.hotelId,
        hotelName: selectedRoom.hotelName,
        roomType: selectedRoom.type,
        checkInDate: userDetails.checkInDate,
        checkOutDate: userDetails.checkOutDate,
        guestDetails: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          phone: userDetails.phone,
          country: selectedCountry?.name || userDetails.country
        },
        roomCount: selectedRoom.count, // Make sure we're using the correct room count
        totalPrice: selectedRoom.totalPrice
      };

      // Validate all required fields are present
      const requiredFields = ['hotelId', 'hotelName', 'roomType', 'checkInDate', 'checkOutDate', 'totalPrice'];
      for (const field of requiredFields) {
        if (!bookingData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const response = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }

      await response.json();
      toast.success("Booking confirmed successfully!");
      
      // Pass the correct room count to update availability
      if (onBookingComplete) {
        onBookingComplete(selectedRoom.hotelId, selectedRoom.type, selectedRoom.count);
      }
      
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to complete booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.reservationForm}>
      <h2>Enter your details</h2>
      <form onSubmit={handleSubmit}>
        {/* Room details section */}
        <div className={styles.roomDetails}>
          <h3>Booking Details</h3>
          {selectedRoom && (
            <>
              <p>
                <strong>Room Type:</strong> {selectedRoom.type}
              </p>
              <p>
                <strong>Rooms:</strong> {selectedRoom.count}
              </p>
              <p>
                <strong>Total Price:</strong> NPR {selectedRoom.totalPrice}
              </p>
            </>
          )}

          {/* Check-in/Check-out dates */}
          <div className={styles.dateInputs}>
            {/* Check-in field at the top */}
            <div className={styles.dateField}>
              <label htmlFor="checkInDate">Check-in Date:</label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                min={formatDate(today)}
                defaultValue={formatDate(today)}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Check-out field below */}
            <div className={styles.dateField}>
              <label htmlFor="checkOutDate">Check-out Date:</label>
              <input
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                min={formatDate(tomorrow)}
                defaultValue={formatDate(tomorrow)}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Personal details */}
        <h3>Guest Information</h3>
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Reserve;