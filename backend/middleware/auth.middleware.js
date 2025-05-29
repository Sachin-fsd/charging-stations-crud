const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();
// Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
         // Check if decoded token has id
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token!' });
    }
};
const authorize = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };