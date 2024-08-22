const mongoose = require("mongoose");

const restaurantOwnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    licenseImg: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    menuImgs: [{ type: String, default: "" }],
    restaurantImgs: [{ type: String, default: "" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bookings" }],

    // point: { type: Number, default: 0 }
  },
  { collection: "restaurantowners" }
);

const RestaurantOwner = mongoose.model(
  "RestaurantOwner",
  restaurantOwnerSchema
);
module.exports = RestaurantOwner;
