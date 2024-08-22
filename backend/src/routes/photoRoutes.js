const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

router.get("/user/:userId", photoController.getPhotosByUserId);

module.exports = router;
