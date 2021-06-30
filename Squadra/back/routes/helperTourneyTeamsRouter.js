const express = require("express");
const router = express.Router();
const tournamentTeamsController =
  require("../controller/").tournamentTeamsController;
const middleware = require("../controller/").middleware;

router.get(
  "/:id",
  middleware.isAuthenticated,
  tournamentTeamsController.getTournamentTeam
);

module.exports = router;
