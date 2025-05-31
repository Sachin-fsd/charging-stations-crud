const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/chargingStation.model');

// Flexible filter: GET /api/charging-stations?name=...&state=...&city=...&id=...&poweroutput=...&connectorType=...&status=...
router.get('/charging-stations', async (req, res) => {
    try {
        const {
            name,
            state,
            city,
            id,
            poweroutput,
            connectorType,
            status
        } = req.query;

        let filter = {};

        if (id) {
            filter._id = id;
        }
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // case-insensitive
        }
        if (state) {
            filter.state = { $regex: state, $options: 'i' };
        }
        if (city) {
            filter.city = { $regex: city, $options: 'i' };
        }
        if (poweroutput) {
            filter.poweroutput = { $gte: Number(poweroutput) };
        }
        if (connectorType) {
            filter.connectorType = { $regex: connectorType, $options: 'i' };
        }
        if (status) {
            filter.status = { $regex: status, $options: 'i' };
        }

        const stations = await ChargingStation.find(filter);
        if (stations.length === 0) {
            return res.status(404).json({ message: 'No charging stations found' });
        }
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching charging stations', error: error.message });
    }
});

// export the router
module.exports = router;
// This code defines an Express.js route for reading charging station data.