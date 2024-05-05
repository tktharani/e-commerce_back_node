const User =require("../models/UserModel")
const Address=require("../models/AddressModel")
const{body,validationResult} = require("express-validator")
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

// User registration
exports.registerUser = async (req, res) => {
    try {
        const { username, password, email, fullName,phonenumber, role,addressData } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, fullName, role,phonenumber });
        await user.save();
        // Create new address
            const address = new Address({ ...addressData, user: user._id });
            await address.save();

            // Associate the address with the user
            user.address = address._id;
            await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

// User login with JWT token generation
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'my-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token,userId: user._id,username:user.username });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};


// List all users
exports.list = async (req, res) => {
    try {
        const users = await User.find().populate('address'); // Populate the address field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};



// Delete a user by ID
exports.delete = async (req, res) => {
    try {
         const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};


// View a user by ID
exports.viewUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('address');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Update a user by ID

exports.update = async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, password, fullName,phonenumber, role, street, city, state, postalCode, country } = req.body;
      if (!username || !email || !fullName || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Check if the password field is not empty
      let hashedPassword = password;
      if (password.trim() !== '') {
        // Hash the password using bcrypt
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Update the user with the hashed password and other details
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, password: hashedPassword, fullName, phonenumber,role },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if address data is provided
      if (street || city || state || postalCode || country) {
        // Check if user already has an address
        if (updatedUser.address) {
          // Update existing address
          const updatedAddress = await Address.findByIdAndUpdate(
            updatedUser.address,
            { street, city, state, postalCode, country },
            { new: true }
          );
          if (!updatedAddress) {
            return res.status(404).json({ error: 'Address not found' });
          }
        } else {
          // Create new address and associate it with the user
          const address = new Address({ street, city, state, postalCode, country, user: userId });
          const savedAddress = await address.save();
          if (!savedAddress) {
            return res.status(500).json({ error: 'Error creating address' });
          }
          // Associate the address with the user
          updatedUser.address = savedAddress._id;
          await updatedUser.save();
        }
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  };
  
  // Function to get user's address
  exports.getUserAddress = async (req, res) => {
    try {
        let userId = req.params.id.trim(); // Trim whitespace
        userId = userId.replace(/\n/g, ''); // Remove newline character

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has an address
        if (!user.address) {
            return res.status(404).json({ error: 'Address not found for this user' });
        }

        // Now you can safely access the address ID
        const addressId = user.address._id;

        // Fetch the address using the addressId and populate the username and phone number from the user
        const address = await Address.findById(addressId).populate({
          path: 'user',
          select: 'username phonenumber', // Select only username and phonenumber fields
      });
        
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Check if the populated user object has the username property
        const username = address.user ? address.user.username : 'N/A';
        const phonenumber = address.user ? address.user.phonenumber : 'N/A';
        
        res.status(200).json({ address, username });
    } catch (error) {
        console.error('Error fetching user address:', error);
        res.status(500).json({ error: 'Error fetching user address' });
    }
};
