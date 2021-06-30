const express = require("express");
const router = express.Router();
const tournamentMatchController =
  require("../controller/").tournamentMatchController;
const middleware = require("../controller/").middleware;

router.post(
  "/",
  middleware.isAuthenticated,
  tournamentMatchController.addTournamentMatch
);
router.get(
  "/:id",
  middleware.isAuthenticated,
  tournamentMatchController.getAllTournamentMatches
);
router.delete(
  "/:id",
  middleware.isAuthenticated,
  tournamentMatchController.deleteTournamentMatch
);
router.put(
  "/:id",
  middleware.isAuthenticated,
  tournamentMatchController.updateTournamentMatch
);

module.exports = router;
