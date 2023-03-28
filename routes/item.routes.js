const express = require("express");
const router = express.Router();
const {
  authenticated,
  adminRole,
} = require("../middleware/authorization");
const { Op } = require("sequelize");
const { Item, User } = require("../database/models");
const ErrorResponse = require("../helpers/error.helper");
const ResponseFormat = require("../helpers/response.helper");
const validate = require("../middleware/validation");
const createItemSchema = require("../validation/schemas/createItem.schema");
const {
  ItemController,
} = require("../controller/item.controller");

const itemController = new ItemController(
  User,
  Item,
  ErrorResponse,
  ResponseFormat,
  validate,
  createItemSchema,
  Op,
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
