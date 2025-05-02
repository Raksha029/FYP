import React from "react";
import styles from "./Profile.module.css";
import { useTranslation } from 'react-i18next';

const Modal = ({
  isOpen,
  onClose,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  onSave,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent2}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>{t('modal.editName')}</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('modal.firstName')}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('modal.lastName')}
          />
          <button className={styles.saveButton} onClick={onSave}>
            {t('modal.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;