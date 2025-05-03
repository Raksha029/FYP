import React, { useState } from "react";
import styles from "./Forgotpassword.module.css"; // Updated styles for ForgotPassword
import { FaEnvelope } from "react-icons/fa"; // Email icon
import forgot from "../Assets/forgot.png"; // Assuming this is an image or asset path
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Improved email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage(t('enterValidEmail'));
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Success message
      } else {
        setMessage(data.error || t('resetPasswordError'));
      }
    } catch (error) {
      setMessage(t('resetPasswordError'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center">
        {/* Center modal in remaining space */}
        <div className={styles.forgotPasswordBackdrop}>
          <div className={styles.forgotPasswordModal}>
            <div className={styles.leftImage}>
              {/* Use the forgot image */}
              <img src={forgot} alt="Forgot Password" />
            </div>
            <div className={styles.formContent}>
            <h2>{t('forgotPasswordTitle')}</h2>
            <p>{t('forgotPasswordSubtitle')}</p>
              <form
                onSubmit={handleSubmit}
                className={styles.forgotPasswordForm}
              >
                <div className={styles.forgotPasswordInputGroup}>
                <label htmlFor="email">{t('email')}</label>
                  <div className={styles.forgotPasswordInputWrapper}>
                    <FaEnvelope className={styles.forgotPasswordIcon} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder={t('emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={styles.forgotPasswordSubmitButton}
                >
                  {t('resetPasswordButton')}
                </button>
              </form>
              {message && (
                <p className={styles.forgotPasswordMessage}>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;