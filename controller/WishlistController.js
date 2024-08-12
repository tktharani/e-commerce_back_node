const Wishlist = require("../models/WishlistModel");
const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        
        const { userId, productId } = req.body;
        
       // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Verify product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found with ID:', productId);
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Find or create wishlist for the user
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }
        
        // Add product to wishlist if not already added
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
        
        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        console.error('Error adding product to wishlist:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if wishlist exists for user
        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(product => product.toString() !== productId);

        await wishlist.save();
        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        console.error('Error removing product from wishlist:', error); // Log the error
        res.status(500).json({ error: 'Error removing product from wishlist' });
    }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find wishlist for user and populate product details
        const wishlist = await Wishlist.findOne({ user: userId })
        .populate('products', 'name image price category') // Populate product details
        .populate('user', 'username'); // Populate user details


        if (!wishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
};
