const Sequelize = require("sequelize");
const db = require("../config/db");

const Message = db.define(
  "Message",
  {
    title: Sequelize.STRING,
    type: Sequelize.STRING,
    content: Sequelize.STRING,
    date: Sequelize.STRING,
    isSolved: Sequelize.BOOLEAN,
    ownerId: Sequelize.INTEGER,
  },
  {
    tableName: "Message",
  }
);

module.exports = Message;
