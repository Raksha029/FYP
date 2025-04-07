import React, { useState, useEffect } from 'react';
import styles from './AdminBooking.module.css';
import { useNavigate } from 'react-router-dom';

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        
        if (!adminToken) {
          navigate('/admin/login');
          return;
        }

        // Using the admin-specific endpoint
        const response = await fetch('http://localhost:4000/api/admin/bookings/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.tableContainer}>
        <h2>Bookings Management</h2>
        <table className={styles.bookingTable}>
          <thead>
            <tr>
              <th>Guest Name</th>
              <th>Hotel</th>
              <th>Room Type</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{`${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`}</td>
                <td>{booking.hotelName}</td>
                <td>{booking.roomType}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>${booking.totalPrice}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooking;