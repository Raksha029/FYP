import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Reservation.module.css";
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';


// Add formatDate function
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Reservation = () => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState("recent");
  const [recentBookings, setRecentBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t('reservation1.loginRequired'));
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:4000/api/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        
        // Filter bookings based on checkout date
        const currentDate = new Date();
        const recent = (data.recentBookings || []).filter(booking => 
          new Date(booking.checkOutDate) >= currentDate && booking.status !== "Cancelled"
        );
        
        const past = [
          ...(data.pastBookings || []),
          ...(data.recentBookings || []).filter(booking => 
            new Date(booking.checkOutDate) < currentDate || booking.status === "Cancelled"
          )
        ];

        setRecentBookings(recent);
        setPastBookings(past);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(t('reservation1.loadError'));
        setIsLoading(false);
      }
    };

    fetchBookings();

    // Check every minute for expired bookings
    const intervalId = setInterval(fetchBookings, 60000);

    return () => clearInterval(intervalId);
  }, [navigate, t]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || t('reservation1.cancelError'));
      }
  
      // Update the booking status locally
      setRecentBookings(prevBookings => 
        prevBookings.filter(booking => booking._id !== bookingId)
      );
      
      const cancelledBooking = recentBookings.find(booking => booking._id === bookingId);
      if (cancelledBooking) {
        setPastBookings(prevBookings => [
          { ...cancelledBooking, status: 'Cancelled' },
          ...prevBookings
        ]);
        addNotification({
          type: 'booking',
          messageKey: 'bookingCancelled',
          messageParams: { 
            hotelName: cancelledBooking.hotelName,
            roomType: cancelledBooking.roomType,
            checkInDate: formatDate
            (cancelledBooking.checkInDate),
            checkOutDate: formatDate(cancelledBooking.checkOutDate)
          },
          message: t('bookingCancelled', { 
            hotelName: t(`hotel.${cancelledBooking.hotelName}`) || cancelledBooking.hotelName,
            roomType: t(`roomType.${cancelledBooking.hotelName}.${cancelledBooking.roomType}`) || cancelledBooking.roomType,
            checkInDate: formatDate(cancelledBooking.checkInDate),
            checkOutDate: formatDate(cancelledBooking.checkOutDate)
          }),
          time: new Date().toLocaleTimeString()
        });

        const existingAdminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
        localStorage.setItem('adminNotifications', JSON.stringify([
          {
            id: Date.now(),
            type: 'booking_cancelled',
            message: `Booking cancelled for ${cancelledBooking.hotelName} - ${cancelledBooking.roomCount}
            {cancelledBooking.roomType} room(s)`,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      read: false
    }, ...existingAdminNotifications
  ]));

        addNotification({
          type: 'hotelError',
          message: t('pointsLost', {
            points: 100, hotelName: cancelledBooking.hotelName
          }), time: new Date().toLocaleTimeString()
  });
            
      }
  
      toast.success(data.message || t('reservation1.cancelSuccess'));
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || t('reservation1.cancelError'));
    }
  };

  useEffect(() => {
    const checkCompletedBookings = () => {
      const currentDate = new Date();
      recentBookings.forEach(booking => {
        const checkOutDate = new Date(booking.checkOutDate);
        if (checkOutDate < currentDate) {
          // Move to past bookings
          setRecentBookings(prev => prev.filter(b => b._id !== booking._id));
          setPastBookings(prev => [{ ...booking, status: 'Completed' }, ...prev]);

          // Add notification for completion
          addNotification({
            type: 'booking',
            messageKey: 'bookingCompleted',
            messageParams: { 
              hotelName: booking.hotelName,
              roomType: booking.roomType,
              checkInDate: formatDate(booking.checkInDate),
              checkOutDate: formatDate(booking.checkOutDate)
            },
            message: t('bookingCompleted', { 
              hotelName: t(`hotel.${booking.hotelName}`) || booking.hotelName,
              roomType: t(`roomType.${booking.hotelName}.${booking.roomType}`),
              checkInDate: formatDate(booking.checkInDate),
              checkOutDate: formatDate(booking.checkOutDate)
            }),
            time: new Date().toLocaleTimeString()
          });
        }
      });
    };

    const intervalId = setInterval(checkCompletedBookings, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [recentBookings, addNotification, t]);


  const handleViewDetails = (booking) => {
    // In handleViewDetails function
    if (!booking || !booking.hotelId) {
      toast.error(t('reservation1.hotelDetailsError'));
      return;
    }

    // Extract city name from hotelId prefix
    let cityName = "kathmandu"; // default city
    if (booking.hotelId.startsWith("kth")) {
      cityName = "kathmandu";
    } else if (booking.hotelId.startsWith("pkh")) {
      cityName = "pokhara";
    } else if (booking.hotelId.startsWith("bkt")) {
      cityName = "baktapur";
    }

    // Navigate using the same structure as TopRatedProperties
    navigate(`/hotel-details/${cityName}/${booking.hotelId}`);
  };

  // Update the JSX where you render the booking cards
  return (
    <div className={styles.reservationContainer}>
      {isLoading ? (
        <div className={styles.loading}>{t('reservation1.loading')}</div>
      ) : (
        <>
          <div className={styles.reservationHeader}>
            <h1>{t('reservation1.myBookings')}</h1>
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "recent" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("recent")}
              >
                {t('reservation1.recent')}
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === "past" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("past")}
              >
                {t('reservation1.past')}
              </button>
            </div>
          </div>

          <div className={styles.reservationContent}>
            <div className={styles.bookingList}>
              {activeTab === "recent" ? (
                recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingDetails}>
                        <h3>{t(`hotel.${booking.hotelName}`)}</h3>
                        <p>{t('reservation1.roomType')}: {t(`roomType.${booking.hotelName}.${booking.roomType}`)}</p>
                        <p>{t('reservation1.numberOfRooms')}: {booking.roomCount}</p>
                        <p>{t('reservation1.checkIn')}: {formatDate(booking.checkInDate)}</p>
                        <p>{t('reservation1.checkOut')}: {formatDate(booking.checkOutDate)}</p>
                        <p>{t('reservation1.totalPrice')}: {booking.currency === 'USD' ? '$' : '₨'} {booking.totalPrice.toLocaleString()}</p>
                        <p>{t('reservation1.status')}: {t(`bookingStatus.${booking.status}`)}</p>
                      </div>
                      <div className={styles.bookingActions}>
                        <button
                          className={styles.viewDetailsBtn}
                          onClick={() => handleViewDetails(booking)}
                        >
                          {t('reservation1.viewHotel')}
                        </button>
                        <button
                          className={styles.cancelBookingBtn}
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          {t('reservation1.cancelBooking')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>{t('reservation1.noRecentBookings')}</p>
                )
              ) : (
                pastBookings.length > 0 ? (
                  // Same changes for past bookings section
                  pastBookings.map((booking) => (
                    <div key={booking._id} className={styles.bookingItem}>
                      <div className={styles.bookingDetails}>
                        <h3>{t(`hotel.${booking.hotelName}`)}</h3>
                        <p>{t('reservation1.roomType')}: {t(`roomType.${booking.hotelName}.${booking.roomType}`)}</p>
                        <p>{t('reservation1.numberOfRooms')}: {booking.roomCount}</p>
                        <p>{t('reservation1.checkIn')}: {formatDate(booking.checkInDate)}</p>
                        <p>{t('reservation1.checkOut')}: {formatDate(booking.checkOutDate)}</p>
                        <p>{t('reservation1.totalPrice')}: {booking.currency === 'USD' ? '$' : '₨'} {booking.totalPrice.toLocaleString()}</p>
                        <p>{t('reservation1.status')}: {t(`bookingStatus.${booking.status}`)}</p>
                      </div>
                      <div className={styles.bookingActions}>
                        <button
                          className={styles.viewDetailsBtn}
                          onClick={() => handleViewDetails(booking)}
                        >
                          {t('reservation1.viewHotel')}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>{t('reservation1.noPastBookings')}</p>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reservation;