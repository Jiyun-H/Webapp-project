const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");

// // Route to get all banners for a specific restaurant owner
// router.get('/:userId', bannerController.getAllBanners);

// // Route to create a new banner for a specific restaurant owner
// router.post('/:userId', bannerController.createBanner);

router.get("/today", bannerController.getTodayBanner);

// Route to get a specific banner by its ID
router.get("/:bannerId", bannerController.getBanner);

//route for fetch exist banner
router.get("/", bannerController.existBanner);

// for redirect to restaurant profile page
router.get("/:id/restaurant", bannerController.getRestaurantByBannerId);

module.exports = router;
