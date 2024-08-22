const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/user/:userId", menuController.getMenusByUserId);

module.exports = router;
