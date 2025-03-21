// HotelWebsite/staybooker/src/Components/Notification/Notification.js
import React from "react";
import styles from "./Notification.module.css";

const Notification = ({ notifications, onClose }) => {
  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.notificationContainer}>
        <h2>All Notifications</h2>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <span>{notification.message}</span>
            <span className={styles.notificationDate}>{notification.date}</span>
            <button
              className={styles.closeButton}
              onClick={() => onClose(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification; // Ensure this line is present
