const express = require("express");
const router = express.Router();
const userMatchesController = require("../controller/").userMatchesController;
const middleware = require("../controller/").middleware;

router.get("/", middleware.isAuthenticated, userMatchesController.getUserPart);

module.exports = router;
