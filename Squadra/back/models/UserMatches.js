const Sequelize = require("sequelize");
const db = require("../config/db");

const UserMatches = db.define(
  "UserMatches",
  {
    UserId: Sequelize.INTEGER,
    MatchId: Sequelize.INTEGER,
    isPresent: Sequelize.BOOLEAN,
  },
  {
    tableName: "UserMatches",
  }
);

module.exports = UserMatches;
