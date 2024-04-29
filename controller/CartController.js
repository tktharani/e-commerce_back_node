const Cart=require("../models/CartModel")

exports.addToCart = async (req, res) => {
  try {
      const { userId, productId, quantity } = req.body;
      // Check if item already exists in the cart for the user
      let cartItem = await Cart.findOne({ user: userId, product: productId });
      if (cartItem) {
          // Update quantity if item exists
          cartItem.quantity += quantity;
          await cartItem.save();
      } else {
          // Create new cart item if it doesn't exist
          cartItem = new Cart({ user: userId, product: productId, quantity });
          await cartItem.save();
      }
      res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
      res.status(500).json({ error: 'Error adding item to cart' });
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // Find and update the cart item
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, productId },
      { quantity },
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart updated', cart: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Error updating cart' });
  }
};
                    // Get user's cart
                    exports.getCart = async (req, res) => {
                      try {
                          const userId = req.userId; // Extracted from token via middleware
                          const userCart = await Cart.find({ userId });
                          res.status(200).json(userCart);
                      } catch (error) {
                          res.status(500).json({ error: 'Error fetching cart' });
                      }
                    };

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
      const cartItemId = req.params.id;
      // Find the cart item by ID and remove it
      const removedItem = await Cart.findByIdAndRemove(cartItemId);
      if (!removedItem) {
          return res.status(404).json({ error: 'Item not found in cart' });
      }
      res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
      res.status(500).json({ error: 'Error removing item from cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
      const userId = req.userId; // Assuming you have the userId available in the request
      // Remove all cart items for the user
      await Cart.deleteMany({ user: userId });
      res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error clearing cart' });
  }
};

