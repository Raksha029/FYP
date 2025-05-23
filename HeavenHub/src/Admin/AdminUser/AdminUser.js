import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from 'react-router-dom';
import styles from "./AdminUser.module.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminUser = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
          navigate('/admin/login'); 
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
  }, [navigate]);


  const handleDeleteClick = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedUsers([]); 
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
            className={`${styles.deleteButton} ${isDeleteMode ? styles.activeDelete : ''}`}
            onClick={handleDeleteClick}
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
                <tr key={user.id}>
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

      {isDeleteMode && selectedUsers.length > 0 && (
        <div className={styles.deleteConfirm}>
          <button onClick={handleDeleteConfirm} className={styles.deleteConfirmButton}>
            Delete Selected ({selectedUsers.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUser;