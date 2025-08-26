const express = require("express");
const router = express.Router();
const Tour = require("../models/Tour");
const multer = require("multer");
const path = require("path");

// Storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, location, category, duration, price, description } = req.body;
        let tags = req.body.tags || [];
        if (!Array.isArray(tags)) tags = [tags];

        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newTour = new Tour({
            title,
            location,
            category,
            duration,
            price,
            description,
            tags,
            image,
        });

        await newTour.save();
        res.status(201).json(newTour);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = upload;
