const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const reviewRoutes = require("./src/routes/reviewRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const photoRoutes = require("./src/routes/photoRoutes");
const restaurantRoutes = require("./src/routes/restaurantRoutes");
const authRoutes = require("./src/routes/authRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const restaurantOwnerRoutes = require("./src/routes/restaurantOwnerRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const bannerRoutes = require('./src/routes/bannerRoutes'); 

const couponRoutes = require("./src/routes/couponRoutes");

const bodyParser = require("body-parser");

const connectDB = require("./src/config/db");

const app = express();

const PORT = process.env.PORT || 5001;

connectDB();

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200
};

// app.use(express.json());
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit:50000 }));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
//
app.use("/api/auth", authRoutes);
app.use("/api/restaurantowners", restaurantOwnerRoutes);
app.use("/api/user", require("./src/routes/userJWTRoutes"));

app.use("/api/coupons", couponRoutes);
app.use('/api/banners', bannerRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/reviews", reviewRoutes);

app.use("/menu", menuRoutes);

app.use("/photo", photoRoutes);

app.use('/menu', menuRoutes);

app.use('/photo', photoRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/restaurants', restaurantRoutes);

app.use('/api/paypal', require('./src/routes/paypalRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
