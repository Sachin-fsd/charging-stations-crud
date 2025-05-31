const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const ChargingStation = require('../models/chargingStation.model');
// const { validateChargingStation } = require('../middleware/validateCharging.middleware');

// Add a new charging station
router.post('/charging-stations', authenticate, authorize('admin'), async (req, res) => {
    try {
        const newStation = new ChargingStation(req.body);
        await newStation.save();
        res.status(201).json(newStation);
    } catch (error) {
        res.status(500).json({ message: 'Error adding charging station', error: error.message });
    }
});

// Export the router
module.exports = router;
// This code defines an Express.js route for adding a new charging station to the database.