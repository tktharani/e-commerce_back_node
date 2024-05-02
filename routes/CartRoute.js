const express = require('express');
const router = express.Router();
const CartController = require('../controller/CartController');
const Cart = require('../models/CartModel');
const User = require('../models/UserModel');
const Product = require('../models/ProductModel');

// Add product to cart route
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const result = await CartController.addToCart(userId, productId, quantity,{ Cart, User, Product });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// GET cart details for a user
router.get('/cart-details/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const cartDetails = await CartController.getCartDetails(userId);
  
      res.status(200).json(cartDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });

module.exports = router;
