const Sequelize = require("sequelize");
const db = require("../config/db");

const Team = db.define(
  "Team",
  {
    name: Sequelize.STRING,
    teammateOneName: Sequelize.STRING,
    teammateOneEmail: Sequelize.STRING,
    teammateTwoName: Sequelize.STRING,
    teammateTwoEmail: Sequelize.STRING,
    ownerId: Sequelize.INTEGER,
  },
  {
    tableName: "Team",
  }
);

module.exports = Team;
