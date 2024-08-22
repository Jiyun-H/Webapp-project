const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Customer = require("../models/customerModel");
const RestaurantOwner = require("../models/restaurantOwnerModel");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const register = async (req, res) => {
  const { email, password, role } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email address");
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    if (role === "customer") {
      const newCustomer = new Customer({ userId: newUser._id, email });
      await newCustomer.save();
    } else if (role === "restaurant-owner") {
      const newRestaurantOwner = new RestaurantOwner({
        userId: newUser._id,
        email,
      });
      // console.log(`Restaurant owner ${newUser._id} saved`);
      await newRestaurantOwner.save();
    }

    res.status(201).json({ userId: newUser._id });
  } catch (error) {
    res.status(400).send("Error registering user");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");
    const token = jwt.sign({ userId: user._id, role: user.role }, "token");
    res.json({ token, _id: user._id, role: user.role });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const requestResetToken = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token and its expiry time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Error generating reset token", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

const requestResetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

module.exports = { register, login, getUserProfile, resetPassword, requestResetToken, requestResetPassword };
