const User = require("../models").User;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const keys = require("../config/keys");
const config = require("../config/config.json");

const userController = {
  addUser: async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      createdGames: req.body.createdGames,
      participatedGames: req.body.participatedGames,
      checkedInGames: req.body.checkedInGames,
      phone: req.body.phone,
      facebook: req.body.facebook,
      isAdmin: req.body.isAdmin,
    };
    try {
      const createdUser = await User.create(user);
      res.status(201).send({
        msg: "Added user with succees",
      });
    } catch (err) {
      res.status(400).send({
        msg: "User not added",
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.status(200).send({
        user,
      });
    } catch (err) {
      res.status(404).send({
        msg: "User not found",
      });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          email: req.params.email,
        },
      });
      res.status(200).send({
        user,
      });
    } catch (err) {
      res.status(404).send({
        msg: "User not found",
      });
    }
  },

  getUserFromReq: async (req, res) => {
    const currentUser = req.user;
    try {
      const user = await User.findOne({
        where: {
          id: currentUser,
        },
      });
      res.status(200).send({
        user,
      });
    } catch (err) {
      res.status(404).send({
        msg: "User not found",
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).send({
        users,
      });
    } catch (err) {
      res.status(404).send({
        msg: "Users not found",
      });
    }
  },

  updateUser: async (req, res) => {
    const userToBeSent = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      createdGames: req.body.createdGames,
      participatedGames: req.body.participatedGames,
      checkedInGames: req.body.checkedInGames,
      phone: req.body.phone,
      facebook: req.body.facebook,
      isAdmin: req.body.isAdmin,
    };
    try {
      userDB = await User.update(userToBeSent, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send({
        msg: "User updated",
      });
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to update a user",
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        await user.destroy();
        res.status(200).send({
          msg: "User deleted",
        });
      } else {
        res.status(404).send({
          msg: "User not found",
        });
      }
    } catch (err) {
      res.status(400).send({
        msg: "Something went wrong while trying to delete a user",
      });
    }
  },

  sendMailToUser: async (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
    };
    const msg = `
    <h3>${user.name} has invited you to join Squadra.</h3>
    <p>Join the application that helps you find other people who want to play basketball today.</p>
    <p>You can find the application <a href="http://localhost:8080/#/">here</a>.</p>
    `;

    let transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Squadra" <gont.vlad@hotmail.com>',
      to: user.email,
      subject: "Squadra Invite",
      html: msg,
    });

    //console.log("Message sent: %s", info.messageId);
    //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).send({
      ceva: "Email sent with success",
    });
  },
};

module.exports = userController;
