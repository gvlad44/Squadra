const express = require("express");
const router = express.Router();
const userController = require("../controller/").userController;
const middleware = require("../controller/").middleware;

router.post("/", middleware.isAuthenticated, userController.addUser);
router.post("/send", middleware.isAuthenticated, userController.sendMailToUser);
router.get("/:id", middleware.isAuthenticated, userController.getUser);
router.get(
  "/mail/:email",
  middleware.isAuthenticated,
  userController.getUserByEmail
);
router.delete("/:id", middleware.isAuthenticated, userController.deleteUser);
router.put("/:id", middleware.isAuthenticated, userController.updateUser);
router.get("/", middleware.isAuthenticated, userController.getUserFromReq);

module.exports = router;
