// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy payment processing endpoint
app.post('/api/payment', (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;

  // Validate input
  if (!cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Simulate processing the payment (this is where you'd connect to a real payment gateway)
  const isValidCard = /^\d{16}$/.test(cardNumber); // Basic validation for 16-digit card number
  const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate); // MM/YY format
  const isValidCVV = /^\d{3}$/.test(cvv); // 3-digit CVV

  if (!isValidCard || !isValidExpiry || !isValidCVV) {
    return res.status(400).json({ error: 'Invalid payment details' });
  }

  // Simulate a success or failure response
  const success = Math.random() > 0.2; // 80% chance of success
  if (success) {
    return res.status(200).json({ message: 'Payment successful! Membership upgraded.' });
  } else {
    return res.status(500).json({ error: 'Payment failed. Please try again.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
