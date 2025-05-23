import React from "react";
import styles from "./Notification.module.css";
import { useTranslation } from 'react-i18next';
import { 
  FaCheck, 
  FaHeart, 
  FaShare, 
  FaCalendar, 
  FaTrash, 
  FaCommentAlt, 
  FaSignInAlt, 
  FaEnvelope,
  FaHotel,
  FaPencilAlt,
  FaPlus
} from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';

const Notification = () => {
  const { t } = useTranslation();
  const { notifications, removeNotification, clearAllNotifications, markAsRead } = useNotification();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FaCalendar className={styles.notificationIcon} />;
      case 'favorite':
        return <FaHeart className={styles.notificationIcon} />;
      case 'share':
        return <FaShare className={styles.notificationIcon} />;
      case 'review':
        return <FaCommentAlt className={styles.notificationIcon} />;
      case 'login':
        return <FaSignInAlt className={styles.notificationIcon} />;
      case 'contact':
        return <FaEnvelope className={styles.notificationIcon} />;
      case 'success':
        return <FaPlus className={styles.notificationIcon} />;
      case 'success1':  
        return <FaPencilAlt className={styles.notificationIcon} />;
      case 'success2':
        return <FaTrash className={styles.notificationIcon} />;
      case 'hotelError':
        return <FaHotel className={styles.notificationIcon} />;
      default:
        return <FaCheck className={styles.notificationIcon} />;
    }
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.notificationContainer}>
        <div className={styles.notificationHeader}>
          <h2>{t('notificationPanel.title')}</h2>
          <div className={styles.headerButtons}>
            {notifications.some(n => !n.read) && (
              <button
                className={styles.markAllReadButton}
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className={styles.clearAllButton}
                onClick={clearAllNotifications}
              >
                <FaTrash /> {t('notificationPanel.clearAll')}
              </button>
            )}
          </div>
        </div>
        {notifications.length === 0 ? (
          <div className={styles.noNotifications}>
            {t('notificationPanel.noNotifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={`${notification.id}-${Math.random().toString(36).substr(2, 9)}`}
              className={`${styles.notificationItem} ${styles[notification.type]} ${
                notification.type.includes('delete') ? styles['delete-action'] : 
                notification.type.includes('update') ? styles['update-action'] :
                notification.type.includes('add') ? styles['add-action'] : ''
              } ${notification.read ? styles.read : styles.unread}`}
              onClick={() => markAsRead(notification.id)}
            >
              {getNotificationIcon(notification.type)}
              <div className={styles.notificationContent}>
                <span className={styles.notificationMessage}>
                  {notification.message}
                </span>
                <span className={styles.notificationTime}>
                  {notification.time}
                </span>
              </div>
              <button
                className={styles.closeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;