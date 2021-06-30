const config = require("./config.json");

module.exports = {
  google: {
    clientID: config.keys.clientId,
    clientSecret: config.keys.clientSecret,
  },
  session: {
    cookieKey: config.keys.cookieKey,
  },
};
