const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String, 
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: false,
    },
    duration: {
        type: String, 
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
    tags: {
        type: [String],
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

module.exports = mongoose.model('Tour', tourSchema);
