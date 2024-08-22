const mongoose = require("mongoose");

const customerCouponSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  description: { type: String },
  used: { type: Boolean, default: false },
  expireDate: { type: Date },
  restaurantName: { type: String },
  value: { type: Number },
});

module.exports = mongoose.model("CustomerCoupon", customerCouponSchema);
