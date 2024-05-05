const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
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

  // Update cart item quantity route
router.put('/update-cart-quantity/:userId/:productId', async (req, res) => {
  try {
      const { userId, productId } = req.params;
      const { quantity } = req.body;

      const result = await CartController.updateCartItemQuantity(userId, productId, quantity);

      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

// Remove item from cart route
router.delete('/remove-from-cart', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const result = await CartController.removeFromCart(userId, productId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Clear cart route
router.delete('/clear-cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await CartController.clearCart(userId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



module.exports = router;
