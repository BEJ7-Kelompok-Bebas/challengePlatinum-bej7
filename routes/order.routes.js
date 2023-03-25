const express = require("express");
const router = express.Router();
const {
  OrderController,
} = require("../controller/order.controller");
const orderController = new OrderController();
const {
  authenticated,
  adminRole,
  userRole,
} = require("../middleware/authorization");

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
