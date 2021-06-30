const TournamentTeams = require("../models").TournamentTeams;
const Team = require("../models").Team;
const Tournament = require("../models").Tournament;

const tournamentTeamsController = {
  addTournamentTeams: async (req, res) => {
    const tournamentTeam = {
      TournamentId: req.body.TournamentId,
      TeamId: req.body.TeamId,
    };
    try {
      const createdTournamentTeam = await TournamentTeams.create(
        tournamentTeam
      );
      res.status(201).send({
        msg: "Added TournamentTeam with success",
      });
    } catch (err) {
      res.status(400).send({
        msg: "TournamentTeam not added",
        err,
      });
    }
  },

  getTournamentTeam: async (req, res) => {
    const currentUser = req.user;
    try {
      const userTeam = await Team.findAll({
        where: {
          ownerId: currentUser,
        },
      });

      if (userTeam.length == 0) {
        res.status(200).send({
          val: false,
          teamId: null,
        });
      }

      var iterator = 0;
      userTeam.forEach(async (el) => {
        const tourneyTeam = await TournamentTeams.findOne({
          where: {
            TournamentId: req.params.id,
            TeamId: el.dataValues.id,
          },
        });

        iterator++;
        if (tourneyTeam != null) {
          res.status(200).send({
            val: true,
            teamId: tourneyTeam.dataValues.TeamId,
          });
        } else {
          if (userTeam.length == iterator) {
            res.status(200).send({
              val: false,
              teamId: null,
            });
          }
        }
      });
    } catch (err) {
      res.status(404).send({
        msg: "TournamentTeam not found",
      });
    }
  },

  getAllTeamsOneTournament: async (req, res) => {
    const tournament = req.params.TournamentId;
    try {
      const tournamentTeams = await TournamentTeams.findAll({
        where: {
          TournamentId: tournament,
        },
      });

      res.status(200).send({
        tournamentTeams,
      });
    } catch (err) {
      res.status(404).send({
        msg: "TournamentTeam not found for this tournament",
      });
    }
  },

  getTeamTournaments: async (req, res) => {
    const tournament = req.params.TeamId;
    try {
      const tournamentTeam = await TournamentTeams.findOne({
        where: {
          TeamId: tournament,
        },
      });
      res.status(200).send({
        tournamentTeam,
      });
    } catch (err) {
      res.status(404).send({
        msg: "TournamentTeam not found",
      });
    }
  },

  deleteTournamentTeams: async (req, res) => {
    try {
      const tournamentTeam = await TournamentTeams.findOne({
        where: {
          TournamentId: req.body.TournamentId,
          TeamId: req.params.TeamId,
        },
      });
      if (tournamentTeam) {
        await tournamentTeam.destroy();
        res.status(200).send({
          msg: "TournamentTeams withdrawn from game",
        });
      } else {
        res.status(404).send({
          msg: "TournamentTeams not found",
        });
      }
    } catch (err) {
      console.log(err);
      res.send({
        msg: "Something went wrong while trying to delete a TournamentTeams",
      });
    }
  },
};

module.exports = tournamentTeamsController;
