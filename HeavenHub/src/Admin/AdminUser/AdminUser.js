import React from 'react';
import styles from './AdminUser.module.css';

const AdminHotel = () => {
  return (
    <div className={styles.hotelContainer}>
      <div className={styles.header}>
        <h2>User</h2>
        <div className={styles.actions}>
          <button className={styles.addButton}>Add New</button>
          <button className={styles.editButton}>Edit</button>
          <button className={styles.deleteButton}>Delete</button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.hotelTable}>
          <thead>
            <tr>
              <th>Id</th>
              <th>User</th>
              <th>City</th>
              <th>phone no</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Hotel Paradise</td>
              <td>New York</td>
              <td>$200</td>
              <td>5-Star</td>
              <td>123-456-7890</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHotel;
