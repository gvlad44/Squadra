const express = require("express");
const router = express.Router();
const matchController = require("../controller/").userMatchesController;
const middleware = require("../controller/").middleware;

router.get(
  "/:MatchId",
  middleware.isAuthenticated,
  matchController.getAllUsersOneMatch
);

module.exports = router;
