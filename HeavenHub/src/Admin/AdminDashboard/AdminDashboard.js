import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalHotels: 0
  });

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

        // Fetch all stats in parallel
        const [bookingsRes, usersRes, hotelsRes] = await Promise.all([
          fetch('http://localhost:4000/api/bookings/count', { headers }),
          fetch('http://localhost:4000/api/users/count', { headers }),
          fetch('http://localhost:4000/api/hotels/count', { headers })
        ]);

        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const hotelsData = await hotelsRes.json();

        console.log('Stats:', { bookings: bookingsData, users: usersData, hotels: hotelsData }); // Debug log

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

  return (
    <div className={styles.mainContent}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statImage}>🏨</div>
          <h3>Total Bookings</h3>
          <p className={styles.statNumber}>{stats.totalBookings}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statImage}>👥</div>
          <h3>Total Users</h3>
          <p className={styles.statNumber}>{stats.totalUsers}</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statImage}>🏢</div>
          <h3>Total Hotels</h3>
          <p className={styles.statNumber}>{stats.totalHotels}</p>
        </div>
      </div>
      <div className={styles.notifications}>
        <h3>Notifications</h3>
        <div className={styles.notificationBox}></div>
      </div>
    </div>
  );
};

export default AdminDashboard;