import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from 'react-router-dom';
import styles from "./AdminBooking.module.css";

const AdminBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext();

  // Add filtered bookings functionality
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    
    const query = searchQuery.toLowerCase();
    return bookings.filter(booking => 
      `${booking.guestDetails?.firstName || ''} ${booking.guestDetails?.lastName || ''}`.toLowerCase().includes(query) ||
      booking.hotelName?.toLowerCase().includes(query) ||
      booking.status?.toLowerCase().includes(query)
    );
  }, [bookings, searchQuery]);

  // Update pagination calculations
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            {currentBookings.map((booking) => (
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

        {currentBookings.length === 0 ? (
          <p className={styles.noResults}>No bookings found matching your search.</p>
        ) : (
          <div className={styles.pagination}>
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
    </div>
  );
};

export default AdminBooking;