import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./AdminUser.module.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Update the PopupForm component to ensure inputs are always controlled
const PopupForm = ({ onSubmit, title, onClose, formData, handleInputChange }) => (
  <div className={styles.popupOverlay} onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}>
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popupHeader}>
        <h2>{title}</h2>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={onSubmit} autoComplete="off">
          <div className={styles.formRow}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city || ''}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone || ''}
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
  </div>
);

const AdminUser = () => {
  const navigate = useNavigate();
  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
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
          navigate('/admin/login'); // Use navigate here
          return;
        }

        const response = await fetch('http://localhost:4000/api/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login'); // Use navigate here
          return;
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
          verified: 'Yes'
        }));

        setUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.message === 'No admin token found' || error.message === 'Unauthorized access') {
          navigate('/admin/login'); // Use navigate here
          return;
        }
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]); // Add navigate to dependency array

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prevData) => {
      if (prevData[name] === value) {
        return prevData; // Avoid state update if the value hasn't changed
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
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

  const handleDeleteConfirm = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      // Delete all selected users
      await Promise.all(selectedUsers.map(userId =>
        fetch(`http://localhost:4000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        })
      ));

      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setIsDeleteMode(false);
      toast.success('Users deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error('Failed to delete users');
    }
  };

  // In the handleAddSubmit function, modify the request body and state update
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:4000/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.username.split(' ')[0],
          lastName: formData.username.split(' ')[1] || '',
          mobileNumber: formData.phone,
          country: formData.city,
          verified: true  // Set verified to true for admin-created users
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
  
      const newUser = await response.json();
      setUsers([...users, {
        id: newUser._id,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        phone: newUser.mobileNumber,
        country: newUser.country,
        verified: 'Yes'  // Always set to 'Yes' for new users
      }]);
  
      setShowAddPopup(false);
      resetForm();
      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
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
        city: user.country, // Changed from user.city to user.country
        password: '', // Password is empty for security
        username: user.name, // Changed from user.username to user.name
        phone: user.phone
      });
      setShowEditPopup(true);
      setIsEditMode(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedUserToEdit) {
      try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:4000/api/admin/users/${selectedUserToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            firstName: formData.username.split(' ')[0],
            lastName: formData.username.split(' ')[1] || '',
            mobileNumber: formData.phone,
            country: formData.city
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        setUsers(users.map(user =>
          user.id === selectedUserToEdit.id
            ? {
                ...user,
                name: formData.username,
                email: formData.email,
                phone: formData.phone,
                country: formData.city
              }
            : user
        ));

        setShowEditPopup(false);
        setSelectedUserToEdit(null);
        resetForm();
        toast.success('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update user');
      }
    }
  };

  // Update the resetForm function
  const resetForm = () => {
    setFormData({
      email: "",
      city: "",
      password: "",
      username: "",
      phone: "",
    });
  };
  
  // Modify the handleAddClick function
  const handleAddClick = () => {
    resetForm(); // Reset form data before showing popup
    setShowAddPopup(true);
  };

  // Calculate pagination indexes
  const { searchQuery } = useOutletContext();

  // Add filtered users functionality
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Update pagination to use filteredUsers
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Update the return statement where the Add User button is rendered
  return (
    <div className={styles.userContainer}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <div className={styles.actions}>
          <button
            className={styles.addButton}
            onClick={handleAddClick}
            disabled={isEditMode || isDeleteMode}
          >
            Add User
          </button>
          <button
            className={`${styles.modifyButton} ${isEditMode ? styles.activeEdit : ''}`}
            onClick={handleEditClick}
            disabled={isDeleteMode}
          >
            {isEditMode ? "Cancel Modify" : "Modify User"}
          </button>
          <button
            className={`${styles.deleteButton} ${isDeleteMode ? styles.activeDelete : ''}`}
            onClick={handleDeleteClick}
            disabled={isEditMode}
          >
            {isDeleteMode ? "Cancel Delete" : "Delete User"}
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
              {currentUsers.map((user) => (
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

          {currentUsers.length === 0 ? (
            <p className={styles.noResults}>No users found matching your search.</p>
          ) : (
            <div className={styles.pagination}>
              {/* Add pagination controls */}
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showAddPopup && (
        <PopupForm
          onSubmit={handleAddSubmit}
          title="Add User"
          onClose={() => {
            setShowAddPopup(false);
            resetForm(); // Reset form when closing
          }}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}

      {showEditPopup && selectedUserToEdit && (
        <PopupForm
          onSubmit={handleEditSubmit}
          title="Edit User"
          onClose={() => {
            setShowEditPopup(false);
            setSelectedUserToEdit(null);
          }}
          formData={formData}
          handleInputChange={handleInputChange}
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