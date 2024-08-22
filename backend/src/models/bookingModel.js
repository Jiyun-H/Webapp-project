const mongoose = require("mongoose");
const Restaurant = require("./restaurantModel");

const bookingSchema = new mongoose.Schema(
  {
    participants: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reservationPerson: {
      type: String,
    },
    restaurantName: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "declined", "cancelled", "finished"],
      default: "pending",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restaurantOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantOwner",
      //required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantListsTest",
      //required: true,
    },
  },
  { collection: "bookings" }
);

module.exports = mongoose.model("Bookings", bookingSchema);
