import React from 'react';
import styles from './AdminRoom.module.css';

const AdminRoom = () => {
  return (
    <div className={styles.roomContainer}>
      <div className={styles.header}>
        <h2>Rooms</h2>
        <div className={styles.actions}>
          <button className={styles.addButton}>Add New</button>
          <button className={styles.editButton}>Edit</button>
          <button className={styles.deleteButton}>Delete</button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.roomTable}>
          <thead>
            <tr>
              <th>Room Id</th>
              <th>Room Type</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Max Occupancy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Deluxe</td>
              <td>$150</td>
              <td>Available</td>
              <td>4</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoom;
