const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/user/:userId", restaurantController.getRestaurantDetails);

router.get("/search", restaurantController.searchRestaurants);
router.get("/type/chinese", restaurantController.getChineseRestaurants);
router.get("/type/german", restaurantController.getGermanRestaurants);
router.get("/type/korean", restaurantController.getKoreanRestaurants);
router.get("/type/italian", restaurantController.getItalianRestaurants);

router.get("/", restaurantController.getRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
