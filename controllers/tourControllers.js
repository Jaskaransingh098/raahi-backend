const Tour = require('../models/Tour');
const multer = require("multer")
const path = require("path")

const parseArrayField = (data) => {
    if (!data) return [];
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) return parsed.filter(item => item.trim());
            return [];
        } catch {
            return [];
        }
    }
    if (Array.isArray(data)) return data.filter(item => item.trim());
    return [];
};
const parseBatches = (data) => {
    if (!data) return [];
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (b) => b.name?.trim() && b.startDate && b.endDate
                );
            }
            return [];
        } catch {
            return [];
        }
    }
    return Array.isArray(data)
        ? data.filter((b) => b.name?.trim() && b.startDate && b.endDate)
        : [];
};

const parseCostPackages = (data) => {
    if (!data) return [];
    if (typeof data === "string") {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (p) => p.packageName?.trim() && p.price
                );
            }
            return [];
        } catch {
            return [];
        }
    }
    return Array.isArray(data)
        ? data.filter((p) => p.packageName?.trim() && p.price)
        : [];
};


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
        const {
            type,
            title,
            discount,
            description,
            category,
            location,
            price,
            duration,
            tags,
            integralFaqs,
            infoFaqs,
            mainFaqs,
        } = req.body;

        if (!title || !description || !category || !location || !duration || !price) {
            return res.status(400).json({ message: "All fields except type and tags are required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }


        const parsedTags = tags
            ? typeof tags === "string"
                ? tags.split(",").map((t) => t.trim())
                : Array.isArray(tags)
                    ? tags
                    : []
            : [];

        const parseFaqs = (data) => {
            if (!data) return [];
            if (typeof data === "string") {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        return parsed.filter(faq => faq.question?.trim() || faq.answer?.trim());
                    }
                    return [];
                } catch {
                    return [];
                }
            }
            if (Array.isArray(data)) {
                return data.filter(faq => faq.question?.trim() || faq.answer?.trim());
            }
            return [];
        };


        const newTour = new Tour({
            type,
            discount: discount && !isNaN(Number(discount)) ? Number(discount) : null,
            title,
            description,
            category,
            location,
            duration,
            price: Number(price),
            tags: parsedTags,
            image: `/uploads/${req.file.filename}`,
            integralFaqs: parseFaqs(req.body.integralFaqs),
            infoFaqs: parseFaqs(req.body.infoFaqs),
            mainFaqs: parseFaqs(req.body.mainFaqs),
            included: parseArrayField(req.body.included), 
            excluded: parseArrayField(req.body.excluded),  
            batches: parseBatches(req.body.batches),
            costPackages: parseCostPackages(req.body.costPackages),
            benefitHighlights: parseArrayField(req.body.benefitHighlights),
        });

        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        console.error("Create tour error:", error);
        res.status(500).json({ message: "Failed to create tour", error: error.message });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (updateData.price) updateData.price = Number(updateData.price);
        if (updateData.discount !== undefined) {
            updateData.discount = updateData.discount && !isNaN(Number(updateData.discount))
                ? Number(updateData.discount)
                : null;
        }

        // Parse tags
        if (updateData.tags && typeof updateData.tags === "string") {
            updateData.tags = updateData.tags.split(",").map((t) => t.trim());
        }

        // Parse FAQ sections
        const parseFaqs = (data) => {
            if (!data) return [];
            if (typeof data === "string") {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed)) {
                        return parsed.filter(faq => faq.question?.trim() || faq.answer?.trim());
                    }
                    return [];
                } catch {
                    return [];
                }
            }
            if (Array.isArray(data)) {
                return data.filter(faq => faq.question?.trim() || faq.answer?.trim());
            }
            return [];
        };

        updateData.integralFaqs = parseFaqs(updateData.integralFaqs);
        updateData.infoFaqs = parseFaqs(updateData.infoFaqs);
        updateData.mainFaqs = parseFaqs(updateData.mainFaqs);
        updateData.included = parseArrayField(updateData.included);
        updateData.excluded = parseArrayField(updateData.excluded);
        updateData.batches = parseBatches(updateData.batches);
        updateData.costPackages = parseCostPackages(updateData.costPackages);
        updateData.benefitHighlights = parseArrayField(updateData.benefitHighlights);


        // Handle image file
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        } else if (updateData.image && updateData.image.startsWith("http")) {
            // normalize old absolute URLs
            updateData.image = updateData.image.replace(/^https?:\/\/[^/]+/, "");
        }


        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedTour) return res.status(404).json({ message: "Tour not found" });
        res.status(200).json(updatedTour);
    } catch (error) {
        console.error("Update tour error:", error);

        res.status(500).json({ message: "Failed to update tour", error: error.message });
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
