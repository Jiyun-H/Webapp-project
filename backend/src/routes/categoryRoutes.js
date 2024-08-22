//定义API路由
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/* router.get('/categories', categoryController.getCategories); */
router.get("/", categoryController.getCategories);

module.exports = router;
