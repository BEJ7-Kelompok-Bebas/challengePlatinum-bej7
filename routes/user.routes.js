const express = require("express");
const router = express.Router();
const {
  authenticated,
  validate,
} = require("../middleware");
const { User } = require("../database/models");
const {
  ErrorResponse,
  ResponseFormat,
} = require("../helpers/");
const {
  Hash,
  ModuleJwt,
  sendEmail,
} = require("../modules");
const { UserController } = require("../controller");

const userController = new UserController(
  User,
  Hash,
  ModuleJwt,
  validate,
  ResponseFormat,
  ErrorResponse,
  sendEmail,
);

router.post("/register", userController.register);
router.get(
  "/register/verify/:token",
  userController.confirmRegister,
);
router.post("/login", userController.login);
router.get("/refresh-token", userController.refreshToken);
router.get(
  "/current-user",
  authenticated,
  userController.currentUser,
);
router.get("/logout", authenticated, userController.logout);

module.exports = router;
