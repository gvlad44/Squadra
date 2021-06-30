const db = require("../config/db");
const User = require("./User");
const Match = require("./Match");
const Message = require("./Message");
const UserMatches = require("./UserMatches");
const Team = require("./Team");
const Tournament = require("./Tournament");
const TournamentMatch = require("./TournamentMatch");
const TournamentTeams = require("./TournamentTeams");

User.hasMany(Match, { foreignKey: "ownerId" });
User.hasMany(Message, { foreignKey: "ownerId" });
User.hasMany(Team, { foreignKey: "ownerId" });
User.hasMany(Tournament, { foreignKey: "ownerId" });
Tournament.hasMany(TournamentMatch, { foreignKey: "tournamentId" });

User.belongsToMany(Match, { through: UserMatches });
Match.belongsToMany(User, { through: UserMatches });
Tournament.belongsToMany(Team, { through: TournamentTeams });
Team.belongsToMany(Tournament, { through: TournamentTeams });

module.exports = {
  User,
  Match,
  Message,
  UserMatches,
  Team,
  Tournament,
  TournamentMatch,
  TournamentTeams,
  connection: db,
};
