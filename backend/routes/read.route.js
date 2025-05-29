const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/chargingStation.model');

// Get all charging stations
router.get('/charging-stations', async (req, res) => {
    try {
        const stations = await ChargingStation.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charging stations' });
    }
});

// Get a single charging station by ID
router.get('/charging-stations/:id', async (req, res) => {
    try {
        const station = await ChargingStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charging station' });
    }
});


// export the router
module.exports = router;
// This code defines an Express.js route for reading charging station data.