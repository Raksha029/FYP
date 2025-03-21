import React from "react";
import styles from "./Profile.module.css"; // Adjust the path as necessary

const Modal = ({
  isOpen,
  onClose,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent2}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Edit Name</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <button className={styles.saveButton} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
