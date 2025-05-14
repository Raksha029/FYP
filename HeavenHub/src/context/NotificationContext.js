import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    // Update unread count
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = (notification) => {
    if (notification.isAdminNotification && !window.location.pathname.includes('/admin')) {
      return;
    }
    setNotifications(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      language: i18n.language,
      messageKey: notification.messageKey,
      messageParams: notification.messageParams,
      read: false,
      ...notification
    }, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      addNotification, 
      removeNotification,
      clearAllNotifications,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};