const Tour = require('../models/Tour');
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });
exports.getAllTours = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type) {
            query.type = { $regex: new RegExp("^" + type + "$", "i") };
        }

        const tours = await Tour.find(query);
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tours', error });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json(tour);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tour', error });
    }
};
exports.createTour = async (req, res) => {
    try {
        
        const { type, title, discount, description, category, location, price, duration, tags } = req.body;

        // Validate required fields (type is optional for user, but admin can set it)
        if (!title || !description || !category || !location || !duration || !price) {
            return res.status(400).json({ message: "All fields except type and tags are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const parsedTags = tags
            ? typeof tags === "string"
                ? tags.split(",").map(tag => tag.trim())
                : Array.isArray(tags)
                    ? tags
                    : []
            : [];

        const newTour = new Tour({
            type, // only admin uses this
            discount: discount !== undefined && discount !== "" ? Number(discount) : null,
            title,
            description,
            category,
            location,
            duration,
            price: Number(price),
            tags: parsedTags,
            image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
        });

        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        console.error("Create tour error:", error);
        res.status(500).json({ message: 'Failed to create tour', error: error.message });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Convert price to number if present
        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.discount !== undefined) {
            updateData.discount = updateData.discount === "" ? null : Number(updateData.discount);
        }

        // Parse tags
        if (updateData.tags) {
            if (typeof updateData.tags === "string") {
                updateData.tags = updateData.tags.split(",").map(tag => tag.trim());
            }
        }

        // Handle image file
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedTour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json(updatedTour);
    } catch (error) {
        console.error("Update tour error:", error);
        res.status(500).json({ message: 'Failed to update tour', error: error.message });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: 'Tour not found' });
        res.status(200).json({ message: 'Tour deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete tour', error });
    }
};
