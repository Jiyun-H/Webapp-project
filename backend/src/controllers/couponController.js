const Coupon = require("../models/couponModel");
const RestaurantOwners = require("../models/restaurantOwnerModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const Customer = require("../models/customerModel");
const CustomerCoupon = require("../models/customerCouponModel");

// every HTTP methods in this controller used for restaurant Owner's coupon CRUD action

// get coupons into restauran owner dashboard based on :userId
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ restaurantOwnerId: req.params.userId });
    res.json({ coupons });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const restaurantOwnerId = req.body.restaurantOwnerId;

    if (!ObjectId.isValid(restaurantOwnerId)) {
      return res.status(400).json({ message: "Invalid restaurantOwnerId" });
    }

    const restaurantOwner = await RestaurantOwners.findOne({
      userId: restaurantOwnerId,
    });
    if (!restaurantOwner) {
      console.error(`Restaurant Owner with ID ${restaurantOwnerId} not found`);
      return res.status(404).json({ message: "Restaurant owner not found" });
    }

    console.log("Restaurant _id:", restaurantOwner._id);
    console.log("RestaurantOwner _id:", restaurantOwner.userId);

    const newCoupon = new Coupon({
      description: req.body.description,
      value: req.body.value,
      expireDate: req.body.expireDate,
      restaurantOwnerId: restaurantOwnerId,
      restaurantName: restaurantOwner.name,
      restaurantId: restaurantOwner._id,
    });

    await newCoupon.save();
    console.log(newCoupon);
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error("Error creating new coupon:", error);
    res.status(500).send("Error creating new coupon");
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coupon) {
      return res.status(404).send("Coupon not found");
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).send("Error updating coupon");
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).send("Coupon not found");
    }
    res.send("Coupon deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting coupon");
  }
};

//HTTP method for Restaurant profile - Coupon purchase

//purchase coupon
exports.buyCoupon = async (req, res) => {
  try {
    const { customerId, couponId } = req.body;

    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const customerCoupon = new CustomerCoupon({
      customerId: customer.userId,
      couponId: couponId,
      expireDate: coupon.expireDate,
      restaurantName: coupon.restaurantName,
      value: coupon.value,
      description: coupon.description,
    });
    console.log(customerCoupon);
    await customerCoupon.save();

    res.status(200).json({
      message: "Coupon bought successfully",
      customerCoupon,
    });
  } catch (error) {
    console.error("Error buying coupon:", error);
    res.status(500).send("Error buying coupon");
  }
};

//For free coupon
exports.buyFreeCoupon = async (req, res) => {
  try {
    const { customerId, couponId } = req.body;

    if (!ObjectId.isValid(customerId) || !ObjectId.isValid(couponId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (customer.point < 10) {
      return res.status(403).json({ message: "Not enough points" });
    }
    customer.point -= 10;
    await customer.save();

    const customerCoupon = new CustomerCoupon({
      customerId: customer.userId,
      couponId: couponId,
      expireDate: coupon.expireDate,
      restaurantName: coupon.restaurantName,
      value: coupon.value,
      description: coupon.description,
    });
    console.log(customerCoupon);
    await customerCoupon.save();

    res.status(200).json({
      message: "Coupon bought successfully",
      customerCoupon,
    });
  } catch (error) {
    console.error("Error buying coupon:", error);
    res.status(500).send("Error buying coupon");
  }
};

//fetch coupon data into restaurant profile page
exports.getCouponsByRestaurantId = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      restaurantId: req.params.restaurantId,
    });
    res.json({ coupons });
  } catch (err) {
    res.status(500).send(err);
  }
};
