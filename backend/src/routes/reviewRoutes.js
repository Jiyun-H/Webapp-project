const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const Restaurant = require('../models/restaurantModel');

router.get("/user/:userId", reviewController.getReviewsByUserId);

router.post('/', reviewController.addReview);

router.delete('/:reviewId/customer/:customerId', reviewController.deleteReviewById);

router.get('/owner/:ownerId', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ owner: req.params.ownerId });
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
