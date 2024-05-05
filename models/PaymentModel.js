const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User schema
  cardNumber: { type: String }, 
  cardholderName: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  // Other payment-related fields as needed
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
