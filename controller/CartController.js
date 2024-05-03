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
 
async function getCartDetails(userId) {
    try {
      console.log('Fetching cart details for user ID:', userId); // Log the user ID
      const cart = await Cart.findOne({ user: userId }).populate('products.product');
  
      if (!cart) {
        // Handle case where cart is not found
        throw new Error('Cart not found for this user.');
      }
      // Calculate total price of the cart
      let totalCartPrice = 0;
      for (const item of cart.products) {
          totalCartPrice += item.product.price * item.quantity;
      }

      // Add total price to the cart object
      cart.totalPrice = totalCartPrice;
  
      return cart;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching cart details.');
    }
  }

  // Function to update the quantity of a product in the cart
async function updateCartItemQuantity(userId, productId, quantity) {
    try {
        // Check if userId is undefined or not a valid ObjectId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId.');
        }

        // Check if productId is undefined or not a valid ObjectId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid productId.');
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error('Cart not found for this user.');
        }

        // Find the product in the cart
        const cartProduct = cart.products.find(p => p.product.toString() === productId);

        if (!cartProduct) {
            throw new Error('Product not found in the cart.');
        }

        // Update the quantity of the product
        cartProduct.quantity = quantity;

        // Calculate total price after updating quantity
        let totalCartPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                totalCartPrice += product.price * item.quantity;
            }
        }
        // Update total price in the cart
        cart.totalPrice = totalCartPrice;

        // Save the updated cart
        await cart.save();

        return { message: 'Cart item quantity updated successfully.', cart };
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw new Error('Error updating cart item quantity.');
    }
}

async function removeFromCart(userId, productId) {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId.');
        }

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid productId.');
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error('Cart not found for this user.');
        }

        const itemIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            console.error('Item not found in cart:', productId);
            throw new Error('Item not found in cart.');
        }

        const item = cart.products[itemIndex];
        const itemPrice = item.product.price;
        const itemQuantity = item.quantity;

        // Remove the item from the cart's products array
        cart.products.splice(itemIndex, 1);

        // Recalculate totalPrice based on remaining items in the cart
        let totalCartPrice = 0;
        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                totalCartPrice += product.price * item.quantity;
            }
        }

        // Update totalPrice in the cart
        cart.totalPrice = totalCartPrice;

        await cart.save();

        return { message: 'Item removed from cart successfully.', cart };
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw new Error('Error removing item from cart.');
    }
}


// Function to clear the cart for a user
async function clearCart(userId) {
    try {
      // Check if userId is undefined or not a valid ObjectId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId.');
      }
  
      // Find and update the cart for the user
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { products: [], totalPrice: 0 } },
        { new: true }
      );
  
      if (!cart) {
        throw new Error('Cart not found for this user.');
      }
  
      return { message: 'Cart cleared successfully.', cart };
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error('Error clearing cart.');
    }
  }
  





module.exports = {
    addToCart,
    getCartDetails,
    updateCartItemQuantity, 
    removeFromCart,
    clearCart,
};