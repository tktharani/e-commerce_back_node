const express = require('express');
const router = express.Router();
const WishlistController = require('../controller/WishlistController');

// Add product to wishlist
router.post('/wishlist/add', WishlistController.addToWishlist);

// Remove product from wishlist
router.post('/wishlist/remove', WishlistController.removeFromWishlist);

// Get user's wishlist
router.get('/wishlist/:userId', WishlistController.getWishlist);

module.exports = router;
