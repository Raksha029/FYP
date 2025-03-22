import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statImage}></div>
          <p>Total booking</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statImage}></div>
          <p>Total users</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statImage}></div>
          <p>Total hotels</p>
        </div>
      </div>
      <div className={styles.notifications}>
        <h3>Notification</h3>
        <div className={styles.notificationBox}></div>
      </div>
    </div>
  );
};

export default AdminDashboard;