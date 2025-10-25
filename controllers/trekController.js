const Trek = require('../models/Treks');


exports.getAllTreks = async (req, res) => {
    try {
        const treks = await Trek.find().sort({ createdAt: -1 });
        res.status(200).json(treks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to fetch treks' });
    }
};

exports.getTrekById = async (req, res) => {
    try {
        const trek = await Trek.findById(req.params.id);
        if (!trek) return res.status(404).json({ message: 'Trek not found' });

        res.status(200).json(trek);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to fetch trek' });
    }
};

exports.createTrek = async (req, res) => {
    try {
        const newTrek = new Trek(req.body);
        const savedTrek = await newTrek.save();
        res.status(201).json(savedTrek);
    } catch (error) {
        res.status(400).json({ message: 'Error creating trek', error });
    }
};

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

exports.deleteTrek = async (req, res) => {
    try {
        const deletedTrek = await Trek.findByIdAndDelete(req.params.id);
        if (!deletedTrek) return res.status(404).json({ message: 'Trek not found' });

        res.status(200).json({ message: 'Trek deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Unable to delete trek' });
    }
};