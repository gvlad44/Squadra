const Match = require("../models").Match;
const User = require("../models").User;

const matchController = {
  addMatch: async (req, res) => {
    const match = {
      place: req.body.place,
      date: req.body.date,
      noParticipants: req.body.noParticipants,
      maxParticipants: req.body.maxParticipants,
      ownerId: req.body.ownerId,
    };
    try {
      const createdMatch = await Match.create(match).then((data) => {
        res.status(201).send({
          data,
          msg: "Added match with succees",
        });
      });
    } catch (err) {
      res.status(400).send({
        msg: "Match not added",
      });
    }
  },

  getMatch: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id, {
        include: { model: User, attributes: ["name"] },
      });
      res.status(200).send({
        match,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({
        msg: "Match not found",
      });
    }
  },

  getNoCreatedGames: async (req, res) => {
    const currentUser = req.user;
    try {
      const matches = await Match.findAll({
        where: {
          ownerId: currentUser,
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
        msg: "Matches not found",
      });
    }
  },

  getAllMatches: async (req, res) => {
    try {
      const matches = await Match.findAll();
      res.status(200).send({
        matches,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Matches not found",
      });
    }
  },

  getAllMatchesOneUser: async (req, res) => {
    const currentUser = req.user;
    try {
      const matches = await Match.findAll({
        where: {
          ownerId: currentUser,
        },
      });
      res.status(200).send({
        matches,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Matches not found",
      });
    }
  },

  updateMatch: async (req, res) => {
    const matchToBeSent = {
      place: req.body.place,
      date: req.body.date,
      noParticipants: req.body.noParticipants,
      maxParticipants: req.body.maxParticipants,
      ownerId: req.body.ownerId,
    };
    try {
      matchDB = await Match.update(matchToBeSent, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        msg: "Match updated",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        msg: "Something went wrong while trying to update a match",
      });
    }
  },

  deleteMatch: async (req, res) => {
    try {
      const match = await Match.findByPk(req.params.id);
      if (match) {
        await match.destroy();
        res.status(200).send({
          msg: "Match deleted",
        });
      } else {
        res.status(404).send({
          msg: "Match not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a match",
      });
    }
  },
};

module.exports = matchController;
