import React from 'react';
import styles from './AdminUser.module.css';

const AdminUser = () => {
  return (
    <div className={styles.userContainer}>
      <div className={styles.header}>
        <h2>Users</h2>
        <div className={styles.actions}>
          <button className={styles.addButton}>Add New</button>
          <button className={styles.editButton}>Edit</button>
          <button className={styles.editButton}>Delete</button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Id</th>
              <th>User</th>
              <th>Email</th>
              <th>City</th>
              <th>Phone no</th>
              
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>New York</td>
              <td>9847751958</td>
             
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
