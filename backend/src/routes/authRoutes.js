const express = require('express');
const { register, login, requestResetToken, resetPassword } = require('../controllers/authController');
const router = express.Router();
// const updateCustomerProfile = require('../controllers/customerController');
const authController = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
// router.post('/profile-setup-customer', updateCustomerProfile);
router.post("/request-reset-token", requestResetToken);
router.post("/reset-password", resetPassword);
router.post("/request-reset-password", authController.requestResetPassword);


module.exports = router;
