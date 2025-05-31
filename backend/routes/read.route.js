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

// Get charging stations by city
router.get('/charging-stations/city/:city', async (req, res) => {
    try {
        const stations = await ChargingStation.find({ city: req.params.city });
        if (stations.length === 0) {
            return res.status(404).json({ message: 'No charging stations found in this city' });
        }
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charging stations by city' });
    }
});

// Get charging stations by state
router.get('/charging-stations/state/:state', async (req, res) => {
    try {
        const stations = await ChargingStation.find({ state: req.params.state });
        if (stations.length === 0) {
            return res.status(404).json({ message: 'No charging stations found in this state' });
        }
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charging stations by state' });
    }
});


// export the router
module.exports = router;
// This code defines an Express.js route for reading charging station data.