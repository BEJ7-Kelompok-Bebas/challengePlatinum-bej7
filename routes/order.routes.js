const express = require("express");
const router = express.Router();
const {
  authenticated,
  userRole,
} = require("../middleware");
const {
  OrderItem,
  Order,
  Item,
} = require("../database/models");
const {
  ErrorResponse,
  ResponseFormat,
} = require("../helpers");
const { updateStock } = require("../modules");
const { OrderController } = require("../controller");

const orderController = new OrderController(
  Order,
  OrderItem,
  Item,
  ErrorResponse,
  ResponseFormat,
  updateStock,
);

router.get(
  "/",
  authenticated,
  userRole,
  orderController.getOrders,
);

router.patch(
  "/:id/update",
  authenticated,
  userRole,
  orderController.updateOrder,
);

router.post(
  "/",
  authenticated,
  userRole,
  orderController.createOrder,
);

router.delete(
  "/:id",
  authenticated,
  userRole,
  orderController.deleteOrder,
);

module.exports = router;
