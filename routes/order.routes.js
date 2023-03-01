const express = require("express");
const router = express.Router();
const {
  OrderController,
} = require("../controller/order.controller");
const orderController = new OrderController();
const {
  authenticated,
  adminRole,
} = require("../middleware/authorization");

router.get("/", authenticated, orderController.getOrders);

router.patch(
  "/:id/update",
  authenticated,
  orderController.updateOrder,
);

router.post(
  "/",
  authenticated,
  orderController.createOrder,
);

router.delete(
  "/:id",
  authenticated,
  adminRole,
  orderController.deleteOrder,
);

module.exports = router;
