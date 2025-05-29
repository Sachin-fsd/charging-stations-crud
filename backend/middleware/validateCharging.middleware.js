const { body, validationResult } = require('express-validator');
// Middleware to validate charging station data
const validateChargingStation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity').isNumeric().withMessage('Capacity must be a number'),
    body('type').notEmpty().withMessage('Type is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Middleware to validate charging station ID
const validateChargingStationId = [
    param('id').isMongoId().withMessage('Invalid charging station ID'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateChargingStation, validateChargingStationId };