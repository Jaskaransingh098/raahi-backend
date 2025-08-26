const express = require('express');
const router = express.Router();
const {
    getAllTreks,
    getTrekById,
    createTrek,
    updateTrek,
    deleteTrek,
} = require('../controllers/trekController');

// Base route: /api/treks

// GET all treks
router.get('/', getAllTreks);

// GET a single trek
router.get('/:id', getTrekById);

// POST create a new trek
router.post('/', createTrek);

// PUT update a trek
router.put('/:id', updateTrek);

// DELETE a trek
router.delete('/:id', deleteTrek);

module.exports = router;