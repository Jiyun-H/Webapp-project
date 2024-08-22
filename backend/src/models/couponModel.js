const mongoose = require("mongoose");
const Restaurant = require("./restaurantModel");

const couponSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  restaurantOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantOwner",
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  description: String,
  value: Number,
  //used: { type: Boolean, default: false },
  expireDate: Date,
  restaurantName: {
    type: String,
  },
});

module.exports = mongoose.model("Coupons", couponSchema);
