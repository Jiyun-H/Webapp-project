const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    point: { type: Number, default: 0 },
  },
  { collection: "customers" }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
