const Tournament = require("../models").Tournament;

const tournamentController = {
  addTournament: async (req, res) => {
    const tournament = {
      name: req.body.name,
      noTeamsParticipating: req.body.noTeamsParticipating,
      maxNoTeams: req.body.maxNoTeams,
      place: req.body.place,
      date: req.body.date,
      ownerId: req.body.ownerId,
    };
    try {
      const createdTournament = await Tournament.create(tournament);
      res.status(201).send({
        msg: "Added Tournament with succees",
        createdTournament,
      });
    } catch (err) {
      res.status(400).send({
        msg: "Tournament not added",
      });
    }
  },

  getTournament: async (req, res) => {
    try {
      const tournament = await Tournament.findByPk(req.params.id);
      res.status(200).send({
        tournament,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Tournament not found",
      });
    }
  },

  getAllTournaments: async (req, res) => {
    try {
      const tournament = await Tournament.findAll();
      res.status(200).send({
        tournament,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Tournament not found",
      });
    }
  },

  updateTournament: async (req, res) => {
    const tournamentToBeSent = {
      name: req.body.name,
      noTeamsParticipating: req.body.noTeamsParticipating,
      maxNoTeams: req.body.maxNoTeams,
      place: req.body.place,
      date: req.body.date,
      ownerId: req.body.ownerId,
    };
    try {
      tournamentDB = await Tournament.update(tournamentToBeSent, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        msg: "Tournament updated",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        msg: "Something went wrong while trying to update a Tournament",
      });
    }
  },

  deleteTournament: async (req, res) => {
    try {
      const tournament = await Tournament.findByPk(req.params.id);
      if (tournament) {
        await tournament.destroy();
        res.status(200).send({
          msg: "Tournament deleted",
        });
      } else {
        res.status(404).send({
          msg: "Tournament not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a Tournament",
      });
    }
  },
};

module.exports = tournamentController;
