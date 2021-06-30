const express = require("express");
const router = express.Router();
const messageController = require("../controller/").messageController;
const middleware = require("../controller/").middleware;

router.post("/", middleware.isAuthenticated, messageController.addMessage);
router.get("/:id", middleware.isAuthenticated, messageController.getMessage);
router.get("/", middleware.isAuthenticated, messageController.getAllMessages);
router.delete(
  "/:id",
  middleware.isAuthenticated,
  messageController.deleteMessage
);
router.put("/:id", middleware.isAuthenticated, messageController.updateMsg);

module.exports = router;
