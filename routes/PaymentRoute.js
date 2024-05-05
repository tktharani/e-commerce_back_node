const express = require('express');
const router = express.Router();
const Payment = require('../models/PaymentModel');
// Route to process payment
router.post('/payment', async (req, res) => {
    const { userId, paymentMethod, cardLastFour, cardholderName, expiryDate, cvv } = req.body;
  
    try {
      // Create a new payment record
      const payment = new Payment({
        user: userId, // Assuming userId is sent from the frontend
        paymentMethod,
        cardLastFour,
        cardholderName,
        expiryDate,
        cvv,
      });
      await payment.save();
  
      // Send success response
      res.json({ success: true, message: 'Payment processed successfully' });
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;
  