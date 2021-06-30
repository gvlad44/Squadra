const express = require("express");
const router = express.Router();
const matchController = require("../controller/").matchController;
const middleware = require("../controller/").middleware;

router.post("/", middleware.isAuthenticated, matchController.addMatch);
router.get("/:id", middleware.isAuthenticated, matchController.getMatch);
router.get("/", middleware.isAuthenticated, matchController.getAllMatches);
router.delete("/:id", middleware.isAuthenticated, matchController.deleteMatch);
router.put("/:id", middleware.isAuthenticated, matchController.updateMatch);

module.exports = router;
