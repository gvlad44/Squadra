const Sequelize = require("sequelize");
const db = require("../config/db");

const TournamentMatch = db.define(
  "TournamentMatch",
  {
    teamOneId: Sequelize.INTEGER,
    teamTwoId: Sequelize.INTEGER,
    scoreTeamOne: Sequelize.INTEGER,
    scoreTeamTwo: Sequelize.INTEGER,
    winnerId: Sequelize.INTEGER,
    tournamentId: Sequelize.INTEGER,
  },
  {
    tableName: "TournamentMatch",
  }
);

module.exports = TournamentMatch;
