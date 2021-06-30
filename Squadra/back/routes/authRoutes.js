const router = require("express").Router();
const passport = require("passport");
const UserDB = require("../models").User;

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
});

// Ruta de autentificare cu google!!!
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Redirect după autentificare cu google!!!
router.get(
  "/google/redirect",
  passport.authenticate("google"),
  async (req, res) => {
    const currentUser = req.user;
    res.redirect("http://localhost:8080/#/home");
  }
);

module.exports = router;
