const Sequelize = require("sequelize");
const db = require("../config/db");

const TournamentTeams = db.define(
  "TournamentTeams",
  {
    TournamentId: Sequelize.INTEGER,
    TeamId: Sequelize.INTEGER,
  },
  {
    tableName: "TournamentTeams",
  }
);

module.exports = TournamentTeams;
