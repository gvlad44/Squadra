const express = require("express");
const router = express.Router();
const teamController = require("../controller/").teamController;
const middleware = require("../controller/").middleware;

router.get("/user", middleware.isAuthenticated, teamController.getAllUserTeams);
router.post("/", middleware.isAuthenticated, teamController.addTeam);
router.get(
  "/name/:name",
  middleware.isAuthenticated,
  teamController.getTeamByName
);
router.get("/:id", middleware.isAuthenticated, teamController.getTeam);
router.get("/", middleware.isAuthenticated, teamController.getAllTeams);
router.delete("/:id", middleware.isAuthenticated, teamController.deleteTeam);

module.exports = router;
