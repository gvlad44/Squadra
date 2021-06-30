const express = require("express");
const router = express.Router();
const tournamentController = require("../controller/").tournamentController;
const middleware = require("../controller/").middleware;

router.post(
  "/",
  middleware.isAuthenticated,
  tournamentController.addTournament
);
router.get(
  "/:id",
  middleware.isAuthenticated,
  tournamentController.getTournament
);
router.get(
  "/",
  middleware.isAuthenticated,
  tournamentController.getAllTournaments
);
router.delete(
  "/:id",
  middleware.isAuthenticated,
  tournamentController.deleteTournament
);
router.put(
  "/:id",
  middleware.isAuthenticated,
  tournamentController.updateTournament
);

module.exports = router;
