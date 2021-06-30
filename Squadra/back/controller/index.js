const userController = require("./userController");
const resetController = require("./reset");
const matchController = require("./matchController");
const messageController = require("./messageController");
const userMatchesController = require("./userMatchesController");
const teamController = require("./teamController");
const tournamentController = require("./tournamentController");
const tournamentMatchController = require("./tournamentMatchController");
const tournamentTeamsController = require("./tournamentTeamsController");
const middleware = require("./middleware");

const controller = {
  userController,
  resetController,
  matchController,
  messageController,
  userMatchesController,
  teamController,
  tournamentController,
  tournamentMatchController,
  tournamentTeamsController,
  middleware,
};

module.exports = controller;
