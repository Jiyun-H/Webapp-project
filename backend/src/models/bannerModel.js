const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  restaurantOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantOwner",
    //required: true,
  },
  description: String,
  imageData: String,
  startDate: Date,
  endDate: Date,
  adCost: Number,
}, {collection: "banners"});

module.exports = mongoose.model("Banners", bannerSchema, "banners");
