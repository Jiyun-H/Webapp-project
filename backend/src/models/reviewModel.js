const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    restaurantOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantOwner",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restaurantName: {
      type: String,
    },

    date: { type: Date, required: true },
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    cost: { type: Number, required: true },
    name: { type: String, required: true },
      images: [{ type: String }],
  },
  { collection: "reviews" }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
