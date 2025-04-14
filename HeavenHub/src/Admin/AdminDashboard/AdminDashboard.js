import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './AdminDashboard.module.css';
import { FaUsers, FaHotel, FaCalendarCheck, FaBell, FaExclamationTriangle, FaCheck, FaTrash } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalHotels: 0
  });

  // Keep notifications state but without backend fetch
  const [notifications, setNotifications] = useState([]);
  const [bookingData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Bookings',
        data: [5, 8, 12, 15, 20, 25, 18],
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        borderColor: '#4CAF50',
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#4CAF50',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#4CAF50',
        pointHoverBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      }
    ]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 13,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 500
          }
        }
      },
      title: {
        display: true,
        text: 'Weekly Booking Trends',
        align: 'start',
        font: {
          size: 20,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 600
        },
        padding: {
          top: 10,
          bottom: 30
        },
        color: '#2c3e50'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        bodyFont: {
          size: 13,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
        },
        titleFont: {
          size: 14,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: 600
        },
        padding: 12,
        boxPadding: 8,
        usePointStyle: true,
        borderColor: '#e9ecef',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${context[0].label}`;
          },
          label: function(context) {
            return `Bookings: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.03)',
          drawBorder: false,
          lineWidth: 1
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          padding: 8,
          color: '#6c757d',
          maxTicksLimit: 6
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          },
          padding: 8,
          color: '#6c757d'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers = {
          'Authorization': `Bearer ${adminToken}`
        };

        const [bookingsRes, usersRes, hotelsRes] = await Promise.all([
          fetch('http://localhost:4000/api/bookings/count', { headers }),
          fetch('http://localhost:4000/api/users/count', { headers }),
          fetch('http://localhost:4000/api/hotels/count', { headers })
        ]);

        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const hotelsData = await hotelsRes.json();

        setStats({
          totalBookings: bookingsData.count || 0,
          totalUsers: usersData.count || 0,
          totalHotels: hotelsData.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const headers = {
          'Authorization': `Bearer ${adminToken}`
        };

        const response = await fetch('http://localhost:4000/api/notifications', { headers });
        const data = await response.json();
        console.log('Fetched notifications:', data); // Add this line to debug
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const ws = new WebSocket('ws://localhost:4000');

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      console.log('New WebSocket notification:', newNotification); // Add this line to debug
      setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    };

    return () => {
      ws.close();
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Remove the notification fetch useEffect
  // Remove WebSocket connection

  // Replace the recentActivity section in the return statement
  return (
    <div className={styles.mainContent}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard Overview</h1>
        <p className={styles.welcomeText}>Welcome back, Admin</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.bookings}`}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <h3>Total Bookings</h3>
              <p className={styles.statNumber}>{stats.totalBookings}</p>
            </div>
            <div className={styles.statIcon}>
              <FaCalendarCheck />
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.users}`}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <h3>Total Users</h3>
              <p className={styles.statNumber}>{stats.totalUsers}</p>
            </div>
            <div className={styles.statIcon}>
              <FaUsers />
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.hotels}`}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <h3>Total Hotels</h3>
              <p className={styles.statNumber}>{stats.totalHotels}</p>
            </div>
            <div className={styles.statIcon}>
              <FaHotel />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.bookingChart}>
          <div className={styles.sectionHeader}>
            <h2>Booking Trends</h2>
          </div>
          <div className={styles.chartContainer}>
            <Line options={options} data={bookingData} />
          </div>
        </div>

        <div className={styles.notifications}>
          <div className={styles.sectionHeader}>
            <h2>Notifications</h2>
            <div className={styles.notificationActions}>
              {notifications.length > 0 && (
                <>
                  <button onClick={markAllAsRead} className={styles.actionButton}>
                    <FaCheck /> Mark all read
                  </button>
                  <button onClick={clearAllNotifications} className={styles.actionButton}>
                    <FaTrash /> Clear all
                  </button>
                </>
              )}
              <div className={styles.notificationIcon}>
                <FaBell />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className={styles.notificationBadge}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.notificationList}>
            {notifications.length > 0 ? (
              <ul className={styles.notificationItems}>
                {notifications.map(notification => (
                  <li 
                    key={notification._id} 
                    className={`${styles.notificationItem} ${styles[notification.type]} ${notification.read ? styles.read : ''}`}
                  >
                    <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                      {notification.type === 'login' && <FaUsers />}
                      {notification.type === 'booking' && <FaCalendarCheck />}
                      {notification.type === 'hotel' && <FaHotel />}
                      {notification.type === 'system' && <FaExclamationTriangle />}
                    </div>
                    <div className={styles.notificationContent}>
                      <p>{notification.message}</p>
                      <span className={styles.notificationTime}>
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noNotifications}>No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
