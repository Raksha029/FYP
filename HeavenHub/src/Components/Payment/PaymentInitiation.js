import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PaymentInitiation = ({ bookingData }) => {
  const navigate = useNavigate();

  const initiateKhaltiPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const paymentData = {
        amount: bookingData.totalPrice * 100, // Convert to paisa
        purchase_order_id: `BOOK-${Date.now()}`,
        purchase_order_name: `${bookingData.hotelName} - ${bookingData.roomType}`,
        customer_info: {
          name: `${bookingData.guestDetails.firstName} ${bookingData.guestDetails.lastName}`,
          email: bookingData.guestDetails.email,
          phone: bookingData.guestDetails.phone
        },
        amount_breakdown: [
          {
            label: "Room Charge",
            amount: bookingData.totalPrice * 100
          }
        ],
        product_details: [
          {
            identity: bookingData.hotelId,
            name: `${bookingData.hotelName} - ${bookingData.roomType}`,
            total_price: bookingData.totalPrice * 100,
            quantity: bookingData.roomCount || 1,
            unit_price: (bookingData.totalPrice / (bookingData.roomCount || 1)) * 100
          }
        ]
      };

      // Store booking data in localStorage for later use
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

      const response = await axios.post(
        'http://localhost:4000/api/payments/initiate',
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect to Khalti payment page
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      navigate('/');
    }
  };

  return (
    <button 
      onClick={initiateKhaltiPayment}
      className="payment-button"
    >
      Pay with Khalti
    </button>
  );
};

export default PaymentInitiation;