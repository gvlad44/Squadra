const express = require("express");
const router = express.Router();
const tournamentMatchController =
  require("../controller/").tournamentMatchController;
const middleware = require("../controller/").middleware;

router.get(
  "/:id/:teamId",
  middleware.isAuthenticated,
  tournamentMatchController.getTeamStats
);

module.exports = router;
