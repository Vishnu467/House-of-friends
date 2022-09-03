const express = require('express');
const router = express.Router();

const authController = require('./auth_controller');
const authValidator = require('./auth_validator');
const validate = require('../../middleware/validate');

const verifyJwt = require("../../middleware/jwt");


router.post('/sent-otp-registration', validate(authValidator.sentotp), authController.sentotp);

router.post('/verify-otp-registration', validate(authValidator.verifyOtp), authController.verifyOtp);

router.post('/register', validate(authValidator.register), authController.register);

router.post('/send-otp-login' , validate(authValidator.sendOtpLogin) , authController.sendOtpLogin)

router.post('/login', validate(authValidator.login), authController.login);

    

module.exports = router;