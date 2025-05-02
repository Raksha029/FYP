import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ChangePassword.module.css"; // Updated styles for ChangePassword
import changePasswordImage from "../Assets/change.png"; // Left-side image
import { useTranslation } from 'react-i18next';  // Add this import at the top

const ChangePassword = () => {
  const { t } = useTranslation();  // Add this line
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to homepage if no token is provided
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage(t('passwordsDoNotMatch'));
      return;
    }

    // Password strength validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      setMessage(t('passwordRequirements'));
      return;
    }

    if (!token) {
      setMessage(t('invalidToken'));
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t('passwordChangeSuccess'));
        setTimeout(() => navigate("/?loginPopup=true"), 3000);
      } else {
        toast.error(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className={styles.changePasswordBackdrop}>
        <div className={styles.changePasswordModal}>
          <div className={styles.leftImage}>
            <img src={changePasswordImage} alt="Change Password" />
          </div>
          <div className={styles.formContent}>
            <h2>{t('changePassword')}</h2>
            <p className="text-gray-600 mt-2">{t('enterNewPassword')}</p>
            <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
              <div className={styles.changePasswordInputGroup}>
                <label htmlFor="password">{t('newPassword')}</label>
                <input
                  type="password"
                  id="password"
                  placeholder={t('enterNewPasswordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.changePasswordInputGroup}>
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder={t('confirmNewPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.changePasswordSubmitButton}
              >
                {t('changePassword')}
              </button>
            </form>
            {message && (
              <p
                className={
                  message.includes(t('successfully'))
                    ? styles.successMessage
                    : styles.errorMessage
                }
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;