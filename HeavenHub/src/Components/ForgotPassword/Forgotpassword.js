import React, { useState } from "react";
import styles from "./Forgotpassword.module.css"; // Updated styles for ForgotPassword
import { FaEnvelope } from "react-icons/fa"; // Email icon
import forgot from "../Assets/forgot.png"; // Assuming this is an image or asset path

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Improved email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email.");
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
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
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
              <h2 className="font-bold text-2xl">Forgot Password!</h2>
              <p className="text-gray-600 mt-2">Enter your registered email</p>
              <form
                onSubmit={handleSubmit}
                className={styles.forgotPasswordForm}
              >
                <div className={styles.forgotPasswordInputGroup}>
                  <label htmlFor="email">Email</label>
                  <div className={styles.forgotPasswordInputWrapper}>
                    <FaEnvelope className={styles.forgotPasswordIcon} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
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
                  Reset Password
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
