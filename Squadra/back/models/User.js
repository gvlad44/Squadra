const Sequelize = require("sequelize");
const db = require("../config/db");

const User = db.define(
  "User",
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    age: Sequelize.INTEGER,
    createdGames: Sequelize.INTEGER,
    participatedGames: Sequelize.INTEGER,
    checkedInGames: Sequelize.INTEGER,
    phone: Sequelize.STRING,
    facebook: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
  },
  {
    tableName: "User",
  }
);

module.exports = User;
