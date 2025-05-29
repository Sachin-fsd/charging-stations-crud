const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
// const { validateRegistration } = require('../middleware/validation.middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// Load environment variables from .env file   
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, username } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role, username });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, ok: true, user: { id: newUser._id, email: newUser.email, role: newUser.role, username: newUser.username } });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Export the router
module.exports = router;
// This code defines an Express.js route for user registration, validating input, hashing the password, and returning a JWT token upon successful registration.