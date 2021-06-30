const express = require("express");
const router = express.Router();
const tournamentTeamsController =
  require("../controller/").tournamentTeamsController;
const middleware = require("../controller/").middleware;

router.get(
  "/:TournamentId",
  middleware.isAuthenticated,
  tournamentTeamsController.getAllTeamsOneTournament
);
router.post(
  "/",
  middleware.isAuthenticated,
  tournamentTeamsController.addTournamentTeams
);
router.get(
  "/ceva/:TeamId",
  middleware.isAuthenticated,
  tournamentTeamsController.getTeamTournaments
);
router.delete(
  "/:TeamId",
  middleware.isAuthenticated,
  tournamentTeamsController.deleteTournamentTeams
);

module.exports = router;
