const mongoose = require("mongoose");

const Reviews = require("./reviewModel");
const Bookings = require("./bookingModel");
const Coupons = require("./couponModel");
const Owner = require("./restaurantOwnerModel");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    type: { type: String, required: true },
    priceRange: { type: String, required: true },
    openingTime: { type: String, required: true },
    menu: [
      {
        dishName: String,
        description: String,
        price: Number,
        image: String,
      },
    ],
    keywords: { type: [String] },
    price: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    description: {
      type: String,
      required: [true, "restaurant description is required"],
    },
    img: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
  },
  { collection: "RestaurantLists2" }
);

const Restaurant = mongoose.model(
  "Restaurant",
  restaurantSchema,
  "RestaurantLists2"
);

module.exports = Restaurant;
