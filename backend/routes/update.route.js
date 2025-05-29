const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/chargingStation.model');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Update a charging station
router.put('/charging-stations/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const updatedStation = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStation) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.json(updatedStation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating charging station', error: error.message });
    }
});

// Export the router
module.exports = router;
// This code defines an Express.js route for updating a charging station's details.