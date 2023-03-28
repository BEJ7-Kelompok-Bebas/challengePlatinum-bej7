const express = require("express");
const router = express.Router();
const {
  authenticated,
  adminRole,
  userRole,
} = require("../middleware/authorization");
const {
  OrderItem,
  Order,
  Item,
} = require("../database/models");
const ErrorResponse = require("../helpers/error.helper");
const ResponseFormat = require("../helpers/response.helper");
const updateStock = require("../modules/updateStock");
const {
  OrderController,
} = require("../controller/order.controller");

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
  adminRole,
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
  adminRole,
  orderController.deleteOrder,
);

module.exports = router;
