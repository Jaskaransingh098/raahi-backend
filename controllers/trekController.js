const Trek = require('../models/Treks');

// @desc    Get all treks
// @route   GET /api/treks
exports.getAllTreks = async (req, res) => {
    try {
        const treks = await Trek.find().sort({ createdAt: -1 });
        res.status(200).json(treks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to fetch treks' });
    }
};

// @desc    Get a single trek by ID
// @route   GET /api/treks/:id
exports.getTrekById = async (req, res) => {
    try {
        const trek = await Trek.findById(req.params.id);
        if (!trek) return res.status(404).json({ message: 'Trek not found' });

        res.status(200).json(trek);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to fetch trek' });
    }
};

// @desc    Create a new trek
// @route   POST /api/treks
exports.createTrek = async (req, res) => {
    try {
        const newTrek = new Trek(req.body);
        const savedTrek = await newTrek.save();
        res.status(201).json(savedTrek);
    } catch (error) {
        res.status(400).json({ message: 'Error creating trek', error });
    }
};

// @desc    Update a trek
// @route   PUT /api/treks/:id
exports.updateTrek = async (req, res) => {
    try {
        const updatedTrek = await Trek.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updatedTrek) return res.status(404).json({ message: 'Trek not found' });

        res.status(200).json(updatedTrek);
    } catch (error) {
        res.status(400).json({ message: 'Error updating trek', error });
    }
};

// @desc    Delete a trek
// @route   DELETE /api/treks/:id
exports.deleteTrek = async (req, res) => {
    try {
        const deletedTrek = await Trek.findByIdAndDelete(req.params.id);
        if (!deletedTrek) return res.status(404).json({ message: 'Trek not found' });

        res.status(200).json({ message: 'Trek deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to delete trek' });
    }
};