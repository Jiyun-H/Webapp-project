const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post(
  "/profile-setup-customer/:userId",
  customerController.updateProfile
);

router.post("/", customerController.createCustomer);
router.get("/:userId", customerController.getCustomers);
router.get("/bookings/:userId", customerController.getBookings);
router.get("/coupons/:userId", customerController.getCoupons);
router.post("/user-cancel/:bookingId", customerController.cancelBooking);
router.put("/coupons/used/:couponId", customerController.putCouponStatus);
router.get("/reviews/:userId", customerController.getReviews);

router.get("/user/:userId", customerController.getCustomerByUserId);

module.exports = router;
