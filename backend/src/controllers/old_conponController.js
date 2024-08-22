const Coupon = require("../models/couponModel");

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json({ coupons });
    } catch (err) {
        res.status(500).send(err);
    }
};
exports.createCoupon = async (req, res) => {
    try {
        const newCoupon = new Coupon({
            description: req.body.description,
            value: req.body.value,
            expireDate: req.body.expireDate,
        });
        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
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