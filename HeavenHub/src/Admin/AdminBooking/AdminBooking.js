// AdminBooking.js
import React from 'react';
import styles from './AdminBooking.module.css';

const AdminBooking = () => {
  return (
    <div className={styles.bookingContainer}>
      <div className={styles.tableContainer}>
      <h2>Bookings</h2>
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Location</th>
              <th>CheckIN</th>
              <th>CheckOUT</th>
              <th>Room</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>New York</td>
              <td>2023-10-01</td>
              <td>2023-10-05</td>
              <td>Deluxe</td>
              <td>$500</td>
              <td>Confirmed</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooking;