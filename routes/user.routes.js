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
  registerSchema,
  loginSchema,
} = require("../validation/schemas");
const { Hash, ModuleJwt } = require("../modules");
const { UserController } = require("../controller");

const userController = new UserController(
  User,
  Hash,
  ModuleJwt,
  validate,
  registerSchema,
  loginSchema,
  ResponseFormat,
  ErrorResponse,
);

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/refresh-token", userController.refreshToken);
router.get(
  "/current-user",
  authenticated,
  userController.currentUser,
);
router.get("/logout", authenticated, userController.logout);

module.exports = router;
