const express = require("express");
const router = express.Router();
const {
  authenticated,
  adminRole,
} = require("../middleware/authorization");
const {
  ItemController,
} = require("../controller/item.controller");
const itemController = new ItemController();

router.get(
  "/",
  authenticated,
  adminRole,
  itemController.getItems,
);
router.post(
  "/",
  authenticated,
  adminRole,
  itemController.createItem,
);
router.get("/:id", authenticated, itemController.getItem);
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
