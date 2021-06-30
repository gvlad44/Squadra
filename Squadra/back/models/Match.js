const Sequelize = require("sequelize");
const db = require("../config/db");

const Match = db.define(
  "Match",
  {
    place: Sequelize.STRING,
    date: Sequelize.STRING,
    noParticipants: Sequelize.INTEGER,
    maxParticipants: Sequelize.INTEGER,
    ownerId: Sequelize.INTEGER,
  },
  {
    tableName: "Match",
  }
);

module.exports = Match;
