const express = require("express");
const router = express.Router();
const matchController = require("../controller/").matchController;
const middleware = require("../controller/").middleware;

router.get(
  "/",
  middleware.isAuthenticated,
  matchController.getAllMatchesOneUser
);

module.exports = router;
