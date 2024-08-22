const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Purchase = require("./src/models/Purchase");
const customerRoutes = require("./src/routes/customerRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const menuRoutes = require("./src/routes/menuRoutes");
const discountRoutes = require("./src/routes/discountRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const bookingRoutes = require(".//src/routes/bookingRoutes");

app.use("/api/menu", menuRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/customers", customerRoutes);

app.post("/mock-paypal", async (req, res) => {
  const { amount, coupons } = req.body;

  try {
    const newPurchase = new Purchase({ amount, coupons });

    await newPurchase.save();

    res.json({ message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Error processing payment" });
  }
});

module.exports = app;
