const Team = require("../models").Team;

const teamController = {
  addTeam: async (req, res) => {
    const team = {
      name: req.body.name,
      teammateOneName: req.body.teammateOneName,
      teammateOneEmail: req.body.teammateOneEmail,
      teammateTwoName: req.body.teammateTwoName,
      teammateTwoEmail: req.body.teammateTwoEmail,
      ownerId: req.body.ownerId,
    };
    try {
      const createdTeam = await Team.create(team);
      res.status(201).send({
        msg: "Added team with succees",
      });
    } catch (err) {
      res.status(400).send({
        msg: "Team not added",
      });
    }
  },

  getTeam: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      res.status(200).send({
        team,
      });
    } catch (err) {
      console.log(err);
      res.status(404).send({
        msg: "Team not found",
      });
    }
  },

  getTeamByName: async (req, res) => {
    try {
      const team = await Team.findOne({
        where: {
          name: req.params.name,
        },
      });
      let variable = false;
      if (team == null) {
        res.status(200).send({
          val: variable,
        });
      } else {
        variable = true;
        res.status(200).send({
          val: variable,
        });
      }
    } catch (err) {
      res.status(404).send({
        msg: "Team not found",
      });
    }
  },

  getAllTeams: async (req, res) => {
    try {
      const team = await Team.findAll();
      res.status(200).send({
        team,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Team not found",
      });
    }
  },

  getAllUserTeams: async (req, res) => {
    const currentUser = req.user;
    try {
      const team = await Team.findAll({
        where: {
          ownerId: currentUser,
        },
      });
      res.status(200).send({
        team,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Team not found",
      });
    }
  },

  deleteTeam: async (req, res) => {
    try {
      const team = await Team.findByPk(req.params.id);
      if (team) {
        await team.destroy();
        res.status(200).send({
          msg: "Team deleted",
        });
      } else {
        res.status(404).send({
          msg: "Team not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a team",
      });
    }
  },
};

module.exports = teamController;
