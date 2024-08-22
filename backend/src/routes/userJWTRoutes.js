const express = require('express');
const auth = require('../middleware/auth');
const { getUserProfile } = require('../controllers/authController');
const router = express.Router();

router.get('/profile', auth, getUserProfile);

module.exports = router;
