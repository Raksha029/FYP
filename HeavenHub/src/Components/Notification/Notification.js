// HotelWebsite/staybooker/src/Components/Notification/Notification.js
import React from "react";
import styles from "./Notification.module.css";

import { FaHotel, FaCalendarCheck, FaBell } from "react-icons/fa";

const Notification = ({ notifications, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FaHotel className={styles.notificationIcon} />;
      case 'cancellation':
        return <FaBell className={styles.notificationIcon} />;
      default:
        return <FaCalendarCheck className={styles.notificationIcon} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.notificationContainer}>
        <h2 className={styles.notificationHeader}>All Notifications</h2>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <div className={styles.notificationContent}>
              {getNotificationIcon(notification.type)}
              <div className={styles.notificationDetails}>
                <span className={styles.notificationMessage}>{notification.message}</span>
                {notification.bookingDetails && (
                  <div className={styles.bookingInfo}>
                    <span className={styles.hotelName}>
                      {notification.bookingDetails.hotelName}
                    </span>
                    <span className={styles.roomType}>
                      Room: {notification.bookingDetails.roomType}
                    </span>
                    <div className={styles.dateInfo}>
                      <span>Check-in: {formatDate(notification.bookingDetails.checkIn)}</span>
                      <span>Check-out: {formatDate(notification.bookingDetails.checkOut)}</span>
                    </div>
                    <span className={styles.price}>
                      Total: ${notification.bookingDetails.totalPrice}
                    </span>
                    <span className={styles.status}>
                      Status: {notification.bookingDetails.status}
                    </span>
                  </div>
                )}
                <span className={styles.notificationDate}>
                  {new Date(notification.date).toLocaleString()}
                </span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => onClose(index)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
