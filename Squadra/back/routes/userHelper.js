const express = require("express");
const router = express.Router();
const userController = require("../controller/").userController;
const middleware = require("../controller/").middleware;

router.get("/", middleware.isAuthenticated, userController.getAllUsers);

module.exports = router;
