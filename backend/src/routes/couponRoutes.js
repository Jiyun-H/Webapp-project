const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

router.get("/user/:userId", couponController.getAllCoupons);
router.post("/", couponController.createCoupon);
router.post("/buy", couponController.buyCoupon);
router.post("/free-download", couponController.buyFreeCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);
router.get(
  "/restaurant/:restaurantId",
  couponController.getCouponsByRestaurantId
);

module.exports = router;
