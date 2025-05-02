// HotelWebsite/staybooker/src/Components/Notification/Notification.js
import React from "react";
import styles from "./Notification.module.css";
import { useTranslation } from 'react-i18next'; // Add translation hook

const Notification = ({ notifications, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.notificationContainer}>
        <h2>{t('notificationPanel.title')}</h2>
        {notifications.map((notification, index) => (
          <div key={index} className={styles.notificationItem}>
            <span>{notification.message}</span>
            <button
              className={styles.closeButton}
              onClick={() => onClose(index)}
            >
              {t('notificationPanel.closeButton')}
              
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification; // Ensure this line is present