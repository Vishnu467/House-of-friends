const express = require("express");
const router = express.Router();

const commonValidator = require('./common.validator')
const commonController = require('./common.controller')

const storageUrl = require("../../middleware/storageImg");

router.post('/uploadFile', storageUrl.single("imgUrl"), commonController.uploadFile);

module.exports = router;