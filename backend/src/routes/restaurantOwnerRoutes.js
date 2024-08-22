const express = require("express");
const router = express.Router();
const restaurantOwnerController = require("../controllers/restaurantOwnerController");
const couponController = require("../controllers/couponController");
const bannerController = require("../controllers/bannerController");
const RestaurantOwner = require('../models/restaurantOwnerModel');

//for banner
router.get("/banners/:userId", bannerController.getAllBanners);
router.post("/banners/:userId", bannerController.createBanner);
//router.get('/banners/:id', bannerController.getBanner);

//for coupon
router.get("/coupons/:userId", couponController.getAllCoupons);
router.post("/coupons", couponController.createCoupon);
router.put("/coupons/:id", couponController.updateCoupon);
router.delete("/coupons/:id", couponController.deleteCoupon);

//get restaurant owenr profile
router.get("/:userId", restaurantOwnerController.getRestaurantOwner);

//for update user profile
router.post(
  "/profile-setup-restaurant-owner/:userId",
  restaurantOwnerController.updateRestaurantOwnerProfile
);

// Fetch restaurant owner details by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        console.log(`Fetching restaurant owner for userId: ${req.params.userId}`);
        const restaurantOwner = await RestaurantOwner.findOne({ userId: req.params.userId });
        if (!restaurantOwner) {
            console.log('Restaurant owner not found');
            return res.status(404).json({ message: 'Restaurant owner not found' });
        }
        res.json(restaurantOwner);
    } catch (error) {
        console.error('Error fetching restaurant owner details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
