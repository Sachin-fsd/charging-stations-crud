const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
// const { validateLogin } = require('../middleware/validation.middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
// Load environment variables from .env file
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret'; 

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token , ok:true, user: { id: user._id, email: user.email, role: user.role, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Export the router
module.exports = router;
// This code defines an Express.js route for user login, validating credentials and returning a JWT token upon successful authentication.