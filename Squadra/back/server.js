const express = require("express");
const app = express();
const port = 8081;
const router = require("./routes");
const authRoutes = require("./routes/authRoutes");
const passportSetup = require("./config/passport_setup");
const cors = require("cors");

// cookie sessions imports
const passport = require("passport");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");

app.use(
  cors({
    origin: ["http://localhost:8080"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Methods",
      "Access-Control-Request-Headers",
    ],
    credentials: true,
    enablePreflight: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  next();
});

//app cookies!!!
app.use(
  cookieSession({
    name: "cookie",
    maxAge: 2 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
    httpOnly: 0,
  })
);

// initiliaze passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./config/db");

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// set up routes
app.use("/api", router);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
