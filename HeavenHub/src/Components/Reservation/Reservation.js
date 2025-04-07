import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Reservation.module.css";

// Add formatDate function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Reservation = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [recentBookings, setRecentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Renamed from loading to isLoading
  const navigate = useNavigate();

  // Add function to check if booking is expired
  const isBookingExpired = (checkOutDate) => {
    return new Date(checkOutDate) < new Date();
  };

  // Modify useEffect to include interval check
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view your bookings");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:4000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        
        // Filter bookings based on checkout date
        const currentDate = new Date();
        const recent = (data.recentBookings || []).filter(booking => 
          new Date(booking.checkOutDate) >= currentDate && booking.status !== "Cancelled"
        );
        
        const past = [
          ...(data.pastBookings || []),
          ...(data.recentBookings || []).filter(booking => 
            new Date(booking.checkOutDate) < currentDate || booking.status === "Cancelled"
          )
        ];

        setRecentBookings(recent);
        setPastBookings(past);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
        setIsLoading(false);
      }
    };

    fetchBookings();

    // Check every minute for expired bookings
    const intervalId = setInterval(fetchBookings, 60000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:4000/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      // Immediately update UI
      const cancelledBooking = recentBookings.find(booking => booking._id === bookingId);
      if (cancelledBooking) {
        setRecentBookings(prev => prev.filter(booking => booking._id !== bookingId));
        setPastBookings(prev => [{ ...cancelledBooking, status: "Cancelled" }, ...prev]);
      }

      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const handleViewDetails = (booking) => {
    if (!booking || !booking.hotelId) {
      toast.error("Hotel details not available");
      return;
    }

    // Extract city name from hotelId prefix
    let cityName = "kathmandu"; // default city
    if (booking.hotelId.startsWith("kth")) {
      cityName = "kathmandu";
    } else if (booking.hotelId.startsWith("pkh")) {
      cityName = "pokhara";
    } else if (booking.hotelId.startsWith("bkt")) {
      cityName = "baktapur";
    }

    // Navigate using the same structure as TopRatedProperties
    navigate(`/hotel-details/${cityName}/${booking.hotelId}`);
  };

  // Update the JSX where you render the booking cards
  return (
    <div className={styles.reservationContainer}>
      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <div className={styles.reservationHeader}>
            <h1>My Bookings</h1>
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "recent" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("recent")}
              >
                Recent Bookings
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "past" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past Bookings
              </button>
            </div>
          </div>

          <div className={styles.reservationContent}>
            <div className={styles.bookingList}>
              {activeTab === "recent" ? (
                recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingDetails}>
                        <h3>{booking.hotelName}</h3>
                        <p>Room Type: {booking.roomType}</p>
                        <p>Number of Rooms: {booking.roomCount}</p>
                        <p>Check-in: {formatDate(booking.checkInDate)}</p>
                        <p>Check-out: {formatDate(booking.checkOutDate)}</p>
                        <p>Total Price: NPR {booking.totalPrice}</p>
                        <p>Status: {booking.status}</p>
                      </div>
                      <div className={styles.bookingActions}>
                        <button
                          className={styles.viewDetailsBtn}
                          onClick={() => handleViewDetails(booking)}
                        >
                          View Hotel
                        </button>
                        <button
                          className={styles.cancelBookingBtn}
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recent bookings found.</p>
                )
              ) : (
                // Past bookings section
                pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingDetails}>
                        <h3>{booking.hotelName}</h3>
                        <p>Room Type: {booking.roomType}</p>
                        <p>Number of Rooms: {booking.roomCount}</p>
                        <p>Check-in: {formatDate(booking.checkInDate)}</p>
                        <p>Check-out: {formatDate(booking.checkOutDate)}</p>
                        <p>Total Price: NPR {booking.totalPrice}</p>
                        <p>Status: {booking.status}</p>
                      </div>
                      <div className={styles.bookingActions}>
                        <button
                          className={styles.viewDetailsBtn}
                          onClick={() => handleViewDetails(booking)}
                        >
                          View Hotel
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No past bookings found.</p>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reservation;