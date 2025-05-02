import React from "react";
import { FaTimes, FaKey } from "react-icons/fa";
import styles from "./Profile.module.css";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{t('passwordModal.title')}</h2>
        <div className={styles.inputGroup}>
          <label>{t('passwordModal.currentPassword')}</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t('passwordModal.enterCurrent')}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>{t('passwordModal.newPassword')}</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('passwordModal.enterNew')}
            />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>{t('passwordModal.confirmPassword')}</label>
          <div className={styles.inputWithIcon}>
            <FaKey className={styles.icon} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('passwordModal.confirmNew')}
            />
          </div>
        </div>
        <button onClick={onSubmit} className={styles.submitButton}>
          {t('passwordModal.changePassword')}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;