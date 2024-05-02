const mongoose = require('mongoose');
const Cart=require('../models/CartModel')
const User=require('../models/UserModel')
const Product=require('../models/ProductModel')



async function addToCart(userId, productId, quantity = 1) {
    try {
        // Check if userId is undefined or not a valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId.');
        }

        // Check if productId is undefined or not a valid ObjectId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid productId.');
        }

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user) {
            throw new Error('User not found.');
        }

        if (!product) {
            throw new Error('Product not found.');
        }

        // Check if the user already has a cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if user doesn't have one
            cart = new Cart({ user: userId });
        }

        // Check if the product is already in the cart
        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            // Update quantity if product is already in cart
            existingProduct.quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({ product: productId, quantity });
        }

        // Calculate total price
        cart.totalPrice += product.price * quantity;

        // Save the updated cart
        await cart.save();

        return { message: 'Product added to cart successfully.', cart };
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw new Error('Error adding product to cart.');
    }
}

module.exports = {
    addToCart,
};
  // Function to get cart details for a user
 // Function to get cart details for a user
async function getCartDetails(userId) {
    try {
      console.log('Fetching cart details for user ID:', userId); // Log the user ID
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
  
      if (!cart) {
        // Handle case where cart is not found
        throw new Error('Cart not found for this user.');
      }
  
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching cart details.');
    }
  }


  module.exports = {
    addToCart,
    getCartDetails,
};

  