const express = require("express");
const router = express.Router();
const {
  authenticated,
  adminRole,
} = require("../middleware");
const { Item, User } = require("../database/models");
const {
  ErrorResponse,
  ResponseFormat,
} = require("../helpers");
const { ItemController } = require("../controller");

const itemController = new ItemController(
  User,
  Item,
  ErrorResponse,
  ResponseFormat,
);

router.get("/", itemController.getItems);
router.post(
  "/",
  authenticated,
  adminRole,
  itemController.createItem,
);
router.get("/:id", itemController.getItem);
router.patch(
  "/:id",
  authenticated,
  adminRole,
  itemController.updateItem,
);
router.delete(
  "/:id",
  authenticated,
  adminRole,
  itemController.deleteItem,
);

module.exports = router;
