import React, { useState, useEffect } from "react";
import styles from "./AdminUser.module.css";

const AdminUser = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    city: "",
    password: "",
    username: "",
    phone: "",
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
          throw new Error('No admin token found');
        }

        const response = await fetch('http://localhost:4000/api/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('Fetched users:', data);

        const formattedUsers = data.map(user => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.mobileNumber || 'N/A',
          country: user.country || 'N/A',
          verified: user.verified ? 'Yes' : 'No'
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteClick = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedUsers([]); // Clear selections when toggling delete mode
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleDeleteConfirm = () => {
    // Delete selected users
    setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
    setSelectedUsers([]);
    setIsDeleteMode(false);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log("Adding:", formData);
    setShowAddPopup(false);
    resetForm();
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
    setSelectedUserToEdit(null);
    setShowEditPopup(false);
  };

  const handleUserSelect = (user) => {
    if (isEditMode) {
      setSelectedUserToEdit(user);
      setFormData({
        email: user.email,
        city: user.city,
        password: user.password,
        username: user.username,
        phone: user.phone,
      });
      setShowEditPopup(true);
      setIsEditMode(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedUserToEdit) {
      // Update the user in the users array
      setUsers(
        users.map((user) =>
          user.id === selectedUserToEdit.id ? { ...user, ...formData } : user
        )
      );
    }
    setShowEditPopup(false);
    setSelectedUserToEdit(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      email: "",
      city: "",
      password: "",
      username: "",
      phone: "",
    });
  };

  const PopupForm = ({ onSubmit, title, onClose }) => (
    <div
      className={styles.popupOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <form onSubmit={onSubmit}>
          <div className={styles.imageUpload}>
            <div className={styles.circle}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
            />
          </div>
          <button type="submit" className={styles.addBtn}>
            {title}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className={styles.userContainer}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddPopup(true)}
          >
            Add User
          </button>
          <button
            className={styles.modifyButton}
            onClick={handleEditClick}
            style={{ backgroundColor: isEditMode ? '#ffc107' : '#28a745' }}
          >
            {isEditMode ? 'Cancel Modify' : 'Modify User'}
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            style={{ backgroundColor: isDeleteMode ? '#dc3545' : '#dc3545' }}
          >
            {isDeleteMode ? 'Cancel Delete' : 'Delete User'}
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                {isDeleteMode && <th>Select</th>}
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  onClick={() => isEditMode && handleUserSelect(user)}
                  className={isEditMode ? styles.editableRow : ''}
                >
                  {isDeleteMode && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                      />
                    </td>
                  )}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.country}</td>
                  <td>{user.verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddPopup && (
        <PopupForm
          onSubmit={handleAddSubmit}
          title="ADD"
          onClose={() => setShowAddPopup(false)}
        />
      )}

      {showEditPopup && selectedUserToEdit && (
        <PopupForm
          onSubmit={handleEditSubmit}
          title="EDIT"
          onClose={() => {
            setShowEditPopup(false);
            setSelectedUserToEdit(null);
          }}
        />
      )}

      {isDeleteMode && selectedUsers.length > 0 && (
        <div className={styles.deleteConfirm}>
          <button onClick={handleDeleteConfirm} className={styles.deleteButton}>
            Delete Selected ({selectedUsers.length})
          </button>
        </div>
      )}

      {isEditMode && (
        <div className={styles.editPrompt}>
          Click on a user to edit their information
        </div>
      )}
    </div>
  );
};

export default AdminUser;