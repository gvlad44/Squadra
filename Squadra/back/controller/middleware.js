const User = require("../models").User;

const controller = {
  // check if user is logged in (MIDDLEWARE)
  isAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      return next();
    }
  },

  // check if the user is admin (MIDDLEWARE)
  isAdmin: async (req, res, next) => {
    console.log(await req.user);
    User.findByPk(req.user).then((user) => {
      console.log(user);
      if (user.isAdmin !== true) {
        res.status(403).send({ message: "Forbidden" });
      } else {
        return next();
      }
    });
  },
};

module.exports = controller;
