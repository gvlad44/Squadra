const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../models").User;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id } });
  done(null, user.id);
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:8081/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, email, done) => {
      User.findOne({
        where: {
          email: email.emails[0].value,
        },
      }).then((currentUser) => {
        if (currentUser == null) {
          let name = email.name.givenName + " " + email.name.familyName;
          User.create({
            name: name,
            email: email.emails[0].value,
            createdGames: 0,
            participatedGames: 0,
            checkedInGames: 0,
            isAdmin: 0,
          })
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          done(null, currentUser);
        }
      });
    }
  )
);
