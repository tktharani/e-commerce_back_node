const User =require("../models/UserModel")
const{body,validationResult} = require("express-validator")
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')

// User registration
exports.registerUser = async (req, res) => {
    try {
        const { username, password, email, fullName, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, fullName, role });
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
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};


// List all users
exports.list = async (req, res) => {
    try {
        const users = await User.find();
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
        const user = await User.findById(userId);
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
      const { username, email, password, fullName, role } = req.body;
      if (!username || !email || !password || !fullName || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
  
      // Check if the password field is not empty
      if (password.trim() !== '') {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        // Update the user with the hashed password
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, password: hashedPassword, fullName, role }, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(updatedUser);
      } else {
        // If password is empty, update user without hashing the password
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, fullName, role }, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  };