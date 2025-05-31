const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Function to connect to MongoDB
// Import routes
const addRoute = require('./routes/add.route');
const updateRoute = require('./routes/update.route');
const readRoute = require('./routes/read.route');
const deleteRoute = require('./routes/delete.route');
const loginRoute = require('./routes/login.route');
const registerRoute = require('./routes/register.route');

const dotenv = require('dotenv');
const { authenticate } = require('./middleware/auth.middleware');
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', loginRoute);
app.use('/api', registerRoute);

// Use routes
app.use(authenticate); // Apply authentication middleware globally
app.use('/check',authenticate, (req, res) => {
    res.json({ message: 'Server is running and authenticated', ok: true, user: { id: req.user._id, email: req.user.email, role: req.user.role, username: req.user.username } });
});
app.use('/api', addRoute);
app.use('/api', updateRoute);
app.use('/api', readRoute);
app.use('/api', deleteRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Middleware for 404 Not Found
app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
// Connect to MongoDB (assuming mongoose is used)

// Start the server
// app.listen(3000, () => {
//     connectDB(); // Function to connect to MongoDB
//     console.log('Server is running on http://localhost:3000');
// });

// ...existing code...
module.exports = app;