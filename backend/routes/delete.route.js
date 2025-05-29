const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/chargingStation.model');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Delete a charging station
router.delete('/charging-stations/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const deletedStation = await ChargingStation.findByIdAndDelete(req.params.id);
        if (!deletedStation) {
            return res.status(404).json({ message: 'Charging station not found' });
        }
        res.json({ message: 'Charging station deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting charging station', error: error.message });
    }
});

// Export the router
module.exports = router;
