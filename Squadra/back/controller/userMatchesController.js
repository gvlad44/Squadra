const UserMatches = require("../models").UserMatches;
const Match = require("../models").Match;
const User = require("../models").User;

const userMatchesController = {
  addUserMatches: async (req, res) => {
    const userMatches = {
      UserId: req.body.UserId,
      MatchId: req.body.MatchId,
      isPresent: false,
    };
    try {
      const createdUserMatches = await UserMatches.create(userMatches);
      res.status(201).send({
        msg: "Added UserMatches with success",
      });
    } catch (err) {
      res.status(400).send({
        msg: "UserMatches not added",
        err,
      });
    }
  },

  getUserPart: async (req, res) => {
    const currentUser = req.user;
    try {
      const users = await UserMatches.findAll({
        where: {
          UserId: currentUser,
        },
      });
      var number = 0;
      users.forEach((el) => {
        number += 1;
      });
      res.status(200).send({
        number: number,
      });
    } catch (err) {
      res.status(404).send({
        msg: "User not found",
      });
    }
  },

  getMatchesPart: async (req, res) => {
    try {
      const matches = await UserMatches.findAll({
        where: {
          MatchId: req.params.MatchId,
        },
      });
      var number = 0;
      matches.forEach((el) => {
        number += 1;
      });
      res.status(200).send({
        number: number,
      });
    } catch (err) {
      res.status(404).send({
        msg: "User not found",
      });
    }
  },

  getUserMatch: async (req, res) => {
    const currentUser = req.user;
    try {
      const userMatch = await UserMatches.findOne({
        where: {
          UserId: currentUser,
          MatchId: req.params.MatchId,
        },
      });
      if (userMatch) {
        res.status(200).send({
          valid: false,
        });
      } else {
        res.status(201).send({
          valid: true,
        });
      }
    } catch (err) {
      res.status(404).send({
        msg: "Match not found",
      });
    }
  },

  getAllUsersOneMatch: async (req, res) => {
    const match = req.params.MatchId;
    try {
      const matchUsers = await UserMatches.findAll({
        where: {
          MatchId: match,
        },
      });

      var userIds = [];
      matchUsers.forEach((el) => {
        userIds.push(el.UserId);
      });

      var userStatuses = [];
      matchUsers.forEach((el) => {
        userStatuses.push(el.isPresent);
      });

      var users = [];
      var it = 0;
      userIds.forEach(async (el) => {
        var status = userStatuses[it];
        try {
          it++;
          const user = await User.findOne({
            where: {
              id: el,
            },
            attributes: ["id", "name", "phone", "facebook"],
          });
          const userToSend = {
            id: user.dataValues.id,
            name: user.dataValues.name,
            phone: user.dataValues.phone,
            facebook: user.dataValues.facebook,
            status: status,
          };
          users.push(userToSend);
        } catch (err) {
          res.status(404).send({
            msg: "UserMatches not found",
          });
        }
        if (it == users.length) {
          res.status(200).send({
            users,
          });
        }
      });
    } catch (err) {
      res.status(404).send({
        msg: "Users not found for this match",
      });
    }
  },

  getAllUserMatches: async (req, res) => {
    const currentUser = req.user;
    try {
      const userMatches = await UserMatches.findAll({
        where: {
          UserId: currentUser,
        },
      });

      var matchesIds = [];
      userMatches.forEach((el) => {
        matchesIds.push(el.MatchId);
      });

      var matches = [];
      var it = 0;
      matchesIds.forEach(async (el) => {
        try {
          it++;
          const match = await Match.findOne({
            where: {
              id: el,
            },
            attributes: [
              "id",
              "place",
              "date",
              "noParticipants",
              "maxParticipants",
              "ownerId",
            ],
          });
          matches.push(match.dataValues);
        } catch (err) {
          console.log(err);
        }
        if (it == matches.length) {
          res.status(200).send({
            matches,
          });
        }
      });
    } catch (err) {
      res.status(404).send({
        msg: "UserMatches not found",
      });
    }
  },

  updateUserMatch: async (req, res) => {
    const toBeSent = {
      UserId: req.body.UserId,
      MatchId: req.body.MatchId,
      isPresent: req.body.isPresent,
    };

    try {
      db = await UserMatches.update(toBeSent, {
        where: {
          UserId: toBeSent.UserId,
          MatchId: toBeSent.MatchId,
        },
      });
      res.status(200).send({
        msg: "Went pretty good",
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({
        msg: "UserMatches not found",
      });
    }
  },

  deleteUserMatches: async (req, res) => {
    const currentUser = req.user;
    try {
      const userMatch = await UserMatches.findOne({
        where: {
          UserId: currentUser,
          MatchId: req.params.MatchId,
        },
      });
      if (userMatch) {
        await userMatch.destroy();
        res.status(200).send({
          msg: "User withdrawn from game",
        });
      } else {
        res.status(404).send({
          msg: "UserMatches not found",
        });
      }
    } catch (err) {
      console.log(err);
      res.send({
        msg: "Something went wrong while trying to delete a userMatches",
      });
    }
  },
};

module.exports = userMatchesController;
