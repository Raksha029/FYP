const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/authMiddleware');

const KHALTI_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://khalti.com/api/v2/'
  : 'https://dev.khalti.com/api/v2/';

// Initiate payment
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const payload = {
      ...req.body,
      website_url: process.env.WEBSITE_URL || 'http://localhost:3000',
      return_url: `${process.env.WEBSITE_URL || 'http://localhost:3000'}/payment/verify`
    };

    const response = await axios.post(
      `${KHALTI_API_URL}epayment/initiate/`,
      payload,
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Verify payment
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { pidx } = req.body;

    const response = await axios.post(
      `${KHALTI_API_URL}epayment/lookup/`,
      { pidx },
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;