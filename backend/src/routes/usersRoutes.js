const express = require("express");
const router = express.Router();
const Users = require("../models/userModel");

// POST route to create a new restaurant
router.post("/", async (req, res) => {
  try {
    const newUsers = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const savedUsers = await newUsers.save();
    res.status(201).send(savedUsers);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
