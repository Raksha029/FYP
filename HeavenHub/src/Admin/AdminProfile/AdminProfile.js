import React from 'react';
import styles from './AdminProfile.module.css';

const AdminProfile = () => {
  return (
    <div className={styles.profileContainer}>
      <h2>Profile</h2>
      <div className={styles.profileContent}>
        <div className={styles.profileImageContainer}>
          <div className={styles.profileImage}></div>
          <p className={styles.greeting}>Hello Admin</p>
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="text" />
          </div>
          <div className={styles.inputGroup}>
            <label>City</label>
            <input type="text" />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" />
          </div>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input type="text" />
          </div>
          <button className={styles.changeButton}>Change</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
