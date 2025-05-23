import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './PaymentVerification.module.css';
import { FaSpinner} from 'react-icons/fa';

const PaymentVerification = () => {
  const [verifying, setVerifying] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pidx = params.get('pidx');
        
        if (!pidx) {
          throw new Error('Payment verification failed');
        }

        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:4000/api/payments/verify',
          { pidx },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status === 'Completed') {
          const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking'));
          
          if (!pendingBooking) {
            throw new Error('No pending booking found');
          }

          // Create booking with the same transaction ID
          const bookingResponse = await axios.post(
            'http://localhost:4000/api/bookings',
            pendingBooking,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (bookingResponse.status === 201) {
            toast.success('Booking confirmed successfully!');
            localStorage.removeItem('pendingBooking');
            navigate('/reservation');
          }
        } else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Payment verification failed');
        navigate('/');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  if (verifying) {
    return (
      <div className={`${styles.landingContainer} min-h-screen`}>
      <div className={styles.container}>
        <div className={styles.card}>
          <FaSpinner className={styles.spinner} />
          <h2>Verifying Payment</h2>
          <p>Please wait while we verify your payment...</p>
        </div>
      </div>
    </div>

    );
  }

  return null;
};

export default PaymentVerification;