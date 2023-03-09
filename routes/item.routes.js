const express = require("express");
const router = express.Router();
const {
  authenticated,
  adminRole,
  sellerRole,
} = require("../middleware/authorization");
const {
  ItemController,
} = require("../controller/item.controller");
const itemController = new ItemController();

router.get("/", itemController.getItems);
router.post(
  "/",
  authenticated,
  adminRole || sellerRole,
  itemController.createItem,
);
router.get("/:id", itemController.getItem);
router.patch(
  "/:id",
  authenticated,
  adminRole || sellerRole,
  itemController.updateItem,
);
router.delete(
  "/:id",
  authenticated,
  adminRole || sellerRole,
  itemController.deleteItem,
);

module.exports = router;
