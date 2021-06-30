const express = require("express");
const router = express.Router();
const userMatchesController = require("../controller/").userMatchesController;
const middleware = require("../controller/").middleware;

router.post(
  "/",
  middleware.isAuthenticated,
  userMatchesController.addUserMatches
);
router.get(
  "/",
  middleware.isAuthenticated,
  userMatchesController.getAllUserMatches
);
router.get(
  "/:MatchId",
  middleware.isAuthenticated,
  userMatchesController.getUserMatch
);
router.delete(
  "/:MatchId",
  middleware.isAuthenticated,
  userMatchesController.deleteUserMatches
);
router.put(
  "/",
  middleware.isAuthenticated,
  userMatchesController.updateUserMatch
);

module.exports = router;
