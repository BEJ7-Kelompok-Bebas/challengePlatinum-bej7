const express = require("express");;
const router = express.Router();;
const {
  authenticated,
  adminRole,
  validate,
} = require("../middleware");
const { Op } = require("sequelize");;
const { 
  Item, User } = require("../database/models");
const {
  ErrorResponse,
  ResponseFormat,
} = require("../helpers");
const createItemSchema = require("../validation/schemas");
const { ItemController } = require("../controller");;
const upload = require('../middleware/multer');

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
  upload.single('image'),
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
