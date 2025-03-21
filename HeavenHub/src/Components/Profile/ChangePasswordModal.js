import React from "react";
import { FaTimes, FaKey } from "react-icons/fa"; // Import the close icon and key icon
import styles from "./Profile.module.css"; // Adjust the path as necessary

const ChangePasswordModal = ({
  isOpen,
  onClose,
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Change Password</h2>
        <div className={styles.inputGroup}>
          <label>Current Password:</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>New Password:</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Confirm New Password:</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <button onClick={onSubmit} className={styles.submitButton}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
