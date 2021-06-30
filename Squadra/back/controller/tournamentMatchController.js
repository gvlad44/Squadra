const TournamentMatch = require("../models").TournamentMatch;
const { Op } = require("sequelize");

const tournamentMatchController = {
  addTournamentMatch: async (req, res) => {
    const tournament = {
      teamOneId: req.body.teamOneId,
      teamTwoId: req.body.teamTwoId,
      scoreTeamOne: req.body.scoreTeamOne,
      scoreTeamTwo: req.body.scoreTeamTwo,
      winnerId: req.body.winnerId,
      tournamentId: req.body.tournamentId,
    };
    try {
      const createdTournament = await TournamentMatch.create(tournament);
      res.status(201).send({
        msg: "Added TournamentMatch with succees",
      });
    } catch (err) {
      res.status(400).send({
        msg: "TournamentMatch not added",
      });
    }
  },

  getAllTournamentMatches: async (req, res) => {
    try {
      const tournament = await TournamentMatch.findAll({
        where: {
          tournamentId: req.params.id,
        },
      });
      res.status(200).send({
        tournament,
      });
    } catch (err) {
      res.status(404).send({
        msg: "TournamentMatch not found",
      });
    }
  },

  getTeamStats: async (req, res) => {
    try {
      const tournament = await TournamentMatch.findAll({
        where: {
          tournamentId: req.params.id,
          [Op.or]: {
            teamOneId: req.params.teamId,
            teamTwoId: req.params.teamId,
          },
        },
      });

      res.status(200).send({
        tournament,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({
        msg: "TournamentMatch not found",
      });
    }
  },

  updateTournamentMatch: async (req, res) => {
    const tournamentToBeSent = {
      teamOneId: req.body.teamOneId,
      teamTwoId: req.body.teamTwoId,
      scoreTeamOne: req.body.scoreTeamOne,
      scoreTeamTwo: req.body.scoreTeamTwo,
      winnerId: req.body.winnerId,
      tournamentId: req.body.tournamentId,
    };
    try {
      tournamentDB = await TournamentMatch.update(tournamentToBeSent, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        msg: "TournamentMatch updated",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        msg: "Something went wrong while trying to update a TournamentMatch",
      });
    }
  },

  deleteTournamentMatch: async (req, res) => {
    try {
      const tournament = await Tournament.findByPk(req.params.id);
      if (tournament) {
        await tournament.destroy();
        res.status(200).send({
          msg: "TournamentMatch deleted",
        });
      } else {
        res.status(404).send({
          msg: "TournamentMatch not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a TournamentMatch",
      });
    }
  },
};

module.exports = tournamentMatchController;
