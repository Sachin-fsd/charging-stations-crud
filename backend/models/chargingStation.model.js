const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Maintenance'],
        default: 'Active'
    },
    powerOutput: {
        type: Number,
        required: true
    },
    connectorType: {
        type: String,
        enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO'],
        required: true
    },
});
const ChargingStation = mongoose.model('ChargingStation', chargingStationSchema);
module.exports = ChargingStation;