import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import styles from "./Profile.module.css"; // Create this CSS file for styling
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa"; // Import edit icon and eye icons
import Modal from "./Modal"; // Import the modal component
import ChangePasswordModal from "./ChangePasswordModal"; // Import the new modal
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    country: "",
    profilePicture: null,
    googleProfilePic: null,
    googleId: null,
  });

  const [showFullMobileNumber, setShowFullMobileNumber] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Helper function to mask sensitive information
  const maskSensitiveInfo = (value, type) => {
    if (!value) return "Not provided";

    switch (type) {
      case "mobileNumber":
        // Show only last 4 digits
        return showFullMobileNumber
          ? value
          : value.slice(0, -4).replace(/\d/g, "*") + value.slice(-4);

      case "email":
        // Mask email
        const [username, domain] = value.split("@");
        return `${username.slice(0, 2)}****@${domain}`;

      default:
        return value;
    }
  };

  // Memoize fetchUserData to prevent unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/user-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data);

        // Add more detailed logging
        console.log("Google ID:", data.googleId);
        console.log("Is Google Login:", !!data.googleId);

        setUserData({
          firstName: data.firstName || data.googleDisplayName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          country: data.country || "",
          profilePicture:
            data.profilePicture ||
            data.googleProfilePic ||
            require("../Assets/b1.jpg"),
          googleProfilePic: data.googleProfilePic,
          googleId: data.googleId, // Ensure this is set correctly
        });
      } else {
        // Handle unauthorized or token expired
        const errorData = await response.json();
        console.error("Failed to fetch user data:", errorData);

        // Clear local storage and redirect to login
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // Fetch user data on component mount and when token changes
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [fetchUserData, navigate]);

  const handleProfilePictureChange = async (file) => {
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload JPEG, PNG, GIF, or WebP."
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const response = await fetch(
            "http://localhost:4000/api/upload-profile-picture",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                profilePicture: reader.result,
              }),
            }
          );

          // Improved error handling
          if (!response.ok) {
            const errorData = await response.text(); // Use text() instead of json()
            console.error("Error Response:", errorData);
            throw new Error(errorData || "Upload failed");
          }

          const responseData = await response.json();

          setUserData((prev) => ({
            ...prev,
            profilePicture: responseData.profilePicture || reader.result,
          }));

          toast.success("Profile picture updated successfully!");
        } catch (error) {
          console.error("Full Upload Error:", error);
          toast.error(error.message || "Failed to upload profile picture");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSave = async (firstName, lastName) => {
    try {
      const response = await fetch("http://localhost:4000/api/update-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (response.ok) {
        setUserData((prev) => ({
          ...prev,
          firstName,
          lastName,
        }));
        setIsEditingName(false);
        toast.success("Name updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update name");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("An error occurred while updating name");
    }
  };

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Validate password
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Password strength validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and contain at least one letter and one number"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (response.ok) {
        toast.success("Password changed successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing password");
    }
  };

  return (
    <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.profileContainer}>
        <div className={styles.header}>
          <h1 className={styles.profileTitle}>Personal Details</h1>
          <p className={styles.infoText}>
            View your info and discover its uses.
          </p>
          <div className={styles.profilePicture}>
            <div className={styles.profilePictureWrapper}>
              <img
                src={userData.profilePicture || userData.googleProfilePic}
                alt="Profile"
                className={styles.profileImage}
              />
              <FaEdit
                className={styles.editIcon}
                onClick={() => document.getElementById("fileInput").click()}
              />
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                handleProfilePictureChange(file);
              }}
            />
          </div>
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.detailRow}>
            <span>Name</span>
            <div className={styles.detailValue}>
              <span>{`${userData.firstName} ${userData.lastName}`}</span>
              <button
                className={styles.editButton}
                onClick={() => setIsEditingName(true)}
              >
                Edit
              </button>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span>Email</span>
            <div className={styles.detailValue}>
              <span>{maskSensitiveInfo(userData.email, "email")}</span>
              <span className={styles.verified}>Verified</span>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span>Mobile Number</span>
            <div className={styles.detailValue}>
              <span>
                {maskSensitiveInfo(userData.mobileNumber, "mobileNumber")}
              </span>
              <button
                onClick={() => setShowFullMobileNumber(!showFullMobileNumber)}
                className={styles.toggleButton}
              >
                {showFullMobileNumber ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span>Country</span>
            <div className={styles.detailValue}>
              <span>{userData.country || "Not provided"}</span>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span>Password</span>
            <div className={styles.detailValue}>
              <span>********</span>
              <button
                onClick={() => setIsChangingPassword(true)}
                className={`${styles.changePasswordButton} ${styles.editButton}`}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isEditingName}
        onClose={() => setIsEditingName(false)}
        firstName={userData.firstName}
        lastName={userData.lastName}
        setFirstName={(firstName) =>
          setUserData((prev) => ({ ...prev, firstName }))
        }
        setLastName={(lastName) =>
          setUserData((prev) => ({ ...prev, lastName }))
        }
        onSave={() => handleNameSave(userData.firstName, userData.lastName)}
      />
      <ChangePasswordModal
        isOpen={isChangingPassword}
        onClose={() => setIsChangingPassword(false)}
        oldPassword={passwordData.oldPassword}
        newPassword={passwordData.newPassword}
        confirmPassword={passwordData.confirmPassword}
        setOldPassword={(oldPassword) =>
          setPasswordData((prev) => ({ ...prev, oldPassword }))
        }
        setNewPassword={(newPassword) =>
          setPasswordData((prev) => ({ ...prev, newPassword }))
        }
        setConfirmPassword={(confirmPassword) =>
          setPasswordData((prev) => ({ ...prev, confirmPassword }))
        }
        onSubmit={handlePasswordChange}
      />
    </div>
  );
};

export default Profile;
