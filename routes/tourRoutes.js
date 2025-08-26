const express = require('express');
const router = express.Router();
const {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
} = require('../controllers/tourControllers');

const upload = require('../middleware/upload');

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post("/", upload.single("image"), createTour);
router.put("/:id", upload.single("image"), updateTour);
router.delete('/:id', deleteTour);

module.exports = router;
