const express = require("express");
const router = express.Router();
const {
  UserController,
} = require("../controller/user.controller");
const {
  authenticated,
} = require("../middleware/authorization");

const userController = new UserController();

router.post("/register", userController.register);
router.get("/register/verify/:token", userController.confirmRegister);
router.post("/login", userController.login);
router.get("/refresh-token", userController.refreshToken);
router.get(
  "/current-user",
  authenticated,
  userController.currentUser,
);
router.get("/logout", authenticated, userController.logout);

module.exports = router;
