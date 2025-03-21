import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { citiesData } from "../data/citiesData";
import styles from "./Reservation.module.css";

const Reservation = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  const [recentBookings, setRecentBookings] = useState([
    {
      id: "1",
      hotelName: "Hyatt Regency Kathmandu",
      location: "Kathmandu",
      bookingDate: "15 Jan 2024",
      checkInDate: "20 Feb 2024",
      status: "Confirmed",
      totalPrice: "$500",
    },
    {
      id: "2",
      hotelName: "Hotel Lake Shore",
      location: "Pokhara",
      bookingDate: "10 Jan 2024",
      checkInDate: "25 Feb 2024",
      status: "Confirmed",
      totalPrice: "$350",
    },
  ]);

  const [pastBookings, setPastBookings] = useState([
    {
      id: "3",
      hotelName: "Heritage Hotel Bhaktapur",
      location: "Baktapur",
      checkInDate: "15 Dec 2023",
      checkOutDate: "20 Dec 2023",
      status: "Completed",
      totalPrice: "$400",
    },
    {
      id: "4",
      hotelName: "Hotel Country Villa",
      location: "Nagarkot",
      checkInDate: "01 Nov 2023",
      checkOutDate: "05 Nov 2023",
      status: "Completed",
      totalPrice: "$300",
    },
  ]);

  const handleViewDetails = (booking) => {
    const matchingCity = Object.keys(citiesData).find((city) =>
      citiesData[city].hotels.some((hotel) => hotel.name === booking.hotelName)
    );

    if (matchingCity) {
      const matchingHotel = citiesData[matchingCity].hotels.find(
        (hotel) => hotel.name === booking.hotelName
      );

      if (matchingHotel) {
        navigate(`/hotel-details/${matchingCity}/${matchingHotel.id}`);
      } else {
        toast.error("Hotel not found");
      }
    } else {
      toast.error("City not found");
    }
  };

  const handleCancelBooking = (bookingId, isRecent) => {
    // Custom toast with confirmation
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to cancel this booking?</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => {
              toast.dismiss(toastId);
              performBookingCancellation(bookingId, isRecent);
            }}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              backgroundColor: "#f0f0f0",
              color: "black",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No, Keep Booking
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const performBookingCancellation = (bookingId, isRecent) => {
    if (isRecent) {
      // Remove from recent bookings and add to past bookings with cancelled status
      const cancelledBooking = recentBookings.find(
        (booking) => booking.id === bookingId
      );

      if (cancelledBooking) {
        // Remove from recent bookings
        const updatedRecentBookings = recentBookings.filter(
          (booking) => booking.id !== bookingId
        );
        setRecentBookings(updatedRecentBookings);

        // Add to past bookings with cancelled status
        const cancelledBookingWithStatus = {
          ...cancelledBooking,
          status: "Cancelled",
          checkOutDate: new Date().toLocaleDateString(),
        };
        setPastBookings([...pastBookings, cancelledBookingWithStatus]);

        // Show success toast
        toast.success("Booking successfully cancelled", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      // For past bookings, simply remove
      const updatedPastBookings = pastBookings.filter(
        (booking) => booking.id !== bookingId
      );
      setPastBookings(updatedPastBookings);

      // Show success toast
      toast.success("Booking removed", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={styles.reservationContainer}>
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
          {activeTab === "recent"
            ? recentBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingItem}>
                  <div className={styles.bookingDetails}>
                    <h3>{booking.hotelName}</h3>
                    <p>Location: {booking.location}</p>
                    <p>Booking Date: {booking.bookingDate}</p>
                    <p>Check-in Date: {booking.checkInDate}</p>
                    <p>Status: {booking.status}</p>
                    <p>Total Price: {booking.totalPrice}</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button
                      className={styles.viewDetailsBtn}
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>
                    <button
                      className={styles.cancelBookingBtn}
                      onClick={() => handleCancelBooking(booking.id, true)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ))
            : pastBookings.map((booking) => (
                <div key={booking.id} className={styles.bookingItem}>
                  <div className={styles.bookingDetails}>
                    <h3>{booking.hotelName}</h3>
                    <p>Location: {booking.location}</p>
                    <p>Check-in Date: {booking.checkInDate}</p>
                    <p>Check-out Date: {booking.checkOutDate}</p>
                    <p>Status: {booking.status}</p>
                    <p>Total Price: {booking.totalPrice}</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button
                      className={styles.viewDetailsBtn}
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </button>
                    {booking.status !== "Completed" && (
                      <button
                        className={styles.cancelBookingBtn}
                        onClick={() => handleCancelBooking(booking.id, false)}
                      >
                        Remove Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Reservation;
