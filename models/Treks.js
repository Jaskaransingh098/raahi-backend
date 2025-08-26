const mongoose = require('mongoose');

const trekSchema = new mongoose.Schema({
    type: {
        type: String,
        default: 'trek',
        enum: ['trek']
    },
    title: {
        type: String, // Instead of "name" for consistency
        required: true,
    },
    region: {
        type: String, // e.g., Sahyadri, Himalayan
        required: true,
    },
    duration: {
        type: String, // e.g., '2 Days / 1 Night'
        required: true,
    },
    difficulty: {
        type: String, // Easy, Moderate, Hard
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    itinerary: {
        type: [String], // Array of day-wise plans
        default: [],
    },
    availableDates: {
        type: [Date],
        default: [],
    },
    image: {
        type: String, // URL or image path
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Trek', trekSchema);
