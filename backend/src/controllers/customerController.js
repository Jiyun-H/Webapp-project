const Customer = require("../models/customerModel");
const Booking = require("../models/bookingModel");
const Coupon = require("../models/couponModel");
const CustomerCoupon = require("../models/customerCouponModel");
const Review = require("../models/reviewModel");
const mongoose = require("mongoose");

//update profile
exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  console.log("Received userId:", userId);
  const { name, profileImg } = req.body;
  try {
    const customer = await Customer.findOne({ userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    customer.name = name;
    customer.profileImg = profileImg;
    await customer.save();
    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile.", error });
  }
};

//create new customer
exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      point: req.body.point,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).send(savedCustomer);
  } catch (err) {
    res.status(400).send(err);
  }
};

// get customers based on :userId
exports.getCustomers = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      userId: req.params.userId,
    });

    if (customer && Object.keys(customer).length > 0) {
      res.json(customer);
    } else {
      console.log("Customer object is empty or null");
      res.status(404).json({ message: "No customer found." });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

// get all coupons based on :userId
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await CustomerCoupon.find({
      customerId: req.params.userId,
    });
    console.log(coupons);
    res.json({ coupons });
  } catch (err) {
    res.status(500).send(err);
  }
};

//put coupon status as used = true after using coupon
exports.putCouponStatus = async (req, res) => {
  console.log("Received couponId:", req.params.couponId);
  const couponId = req.params.couponId;

  try {
    const updatedCoupon = await CustomerCoupon.findByIdAndUpdate(
      couponId,
      {
        $set: { used: true },
      },
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).send("Coupon not found.");
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).send("Error updating coupon status: " + error.message);
  }
};

// get all bookings based on :userId
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.params.userId });
    res.json({ bookings });
  } catch (err) {
    res.status(500).send(err);
  }
};

// get all reviews based based on :userId
exports.getReviews = async (req, res) => {
  try {
    //console.log("Received userID:", req.params.userId);
    const reviews = await Review.find({
      customerId: req.params.userId,
    });

    res.json({ reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).send(err);
  }
};

//new add

exports.getCustomerByUserId = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.params.userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// booking cancelled by customer side
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params; // bring booking url
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking.", error });
  }
};
