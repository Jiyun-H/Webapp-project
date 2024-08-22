const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/add-booking", bookingController.addBooking);

// Get all bookings for restaurant owner
router.get("/:userId", bookingController.getAllBookings);

// Update booking status
router.post("/status-update", bookingController.updateBookingStatus);

// Cancel booking
router.post("/cancel", bookingController.cancelBooking);

module.exports = router;
