const Sequelize = require("sequelize");
const db = require("../config/db");

const Tournament = db.define(
  "Tournament",
  {
    name: Sequelize.STRING,
    noTeamsParticipating: Sequelize.STRING,
    maxNoTeams: Sequelize.STRING,
    place: Sequelize.STRING,
    date: Sequelize.STRING,
    ownerId: Sequelize.INTEGER,
  },
  {
    tableName: "Tournament",
  }
);

module.exports = Tournament;
