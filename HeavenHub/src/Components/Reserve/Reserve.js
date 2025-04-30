import React, { useState, useEffect } from "react";
import styles from "./Reserve.module.css";
import { toast } from "react-toastify";

const Reserve = ({ userDetails, setUserDetails, onClose, selectedRoom, onBookingComplete }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [totalPrice, setTotalPrice] = useState(selectedRoom?.totalPrice || 0);

  // Update the useEffect for discount check
  useEffect(() => {
    try {
      const loyaltyDiscountStr = localStorage.getItem('loyaltyDiscount');
      if (!loyaltyDiscountStr) {
        setTotalPrice(selectedRoom?.totalPrice || 0);
        setAppliedDiscount(null);
        return;
      }
  
      const loyaltyDiscount = JSON.parse(loyaltyDiscountStr);
      
      // Check if discount is valid for this specific hotel and not expired
      if (loyaltyDiscount && 
          loyaltyDiscount.hotelId === selectedRoom?.hotelId && 
          new Date(loyaltyDiscount.validUntil) > new Date()) {
        const discountedPrice = selectedRoom.totalPrice * 0.8; // 20% off
        setTotalPrice(discountedPrice);
        setAppliedDiscount(loyaltyDiscount);
      } else {
        setTotalPrice(selectedRoom?.totalPrice || 0);
        setAppliedDiscount(null);
        // Clear invalid or non-matching hotel discount
        localStorage.removeItem('loyaltyDiscount');
      }
    } catch (error) {
      console.error('Error processing discount:', error);
      setTotalPrice(selectedRoom?.totalPrice || 0);
      setAppliedDiscount(null);
    }
  }, [selectedRoom]);

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      // Check if user is logged in first
      if (!isLoggedIn || !token) {
        toast.error('Please login to make a booking');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare booking data
      const bookingData = {
        hotelId: selectedRoom.hotelId,
        hotelName: selectedRoom.hotelName,
        roomType: selectedRoom.type,
        checkInDate: document.getElementById('checkInDate').value,
        checkOutDate: document.getElementById('checkOutDate').value,
        guestDetails: userDetails,
        roomCount: selectedRoom.count || 1,
        totalPrice: totalPrice
      };
  
      // Only add discount if it's valid
      if (appliedDiscount) {
        bookingData.discountCode = appliedDiscount.discountCode;
        bookingData.discountPercentage = 20;
      }
  
      const response = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
  
      
      // Clear the loyalty discount after successful booking
      if (appliedDiscount) {
        localStorage.removeItem('loyaltyDiscount');
      }
  
      toast.success('Booking confirmed successfully!');
      onBookingComplete(selectedRoom.hotelId, selectedRoom.type, selectedRoom.count || 1);
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <strong>Total Price:</strong> NPR {totalPrice}
                {appliedDiscount && (
                  <span className={styles.discountLabel}> (20% loyalty discount applied)</span>
                )}
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