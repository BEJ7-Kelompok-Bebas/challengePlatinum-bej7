class OrderController {
  constructor(
    Order,
    OrderItem,
    Item,
    ErrorResponse,
    ResponseFormat,
    updateStock,
  ) {
    this.Order = Order;
    this.OrderItem = OrderItem;
    this.Item = Item;
    this.ErrorResponse = ErrorResponse;
    this.ResponseFormat = ResponseFormat;
    this.updateStock = updateStock;
  }

  async getOrders(req, res, next) {
    try {
      const {
        query: { status, order_id },
      } = req;

      const user_id = res.locals.userId;

      let queryObject = { user_id: user_id };
      if (status) {
        queryObject.status = status;
      }

      if (order_id) {
        queryObject.order_id = order_id;
      }

      const order = await this.Order.findAll({
        where: {
          ...queryObject,
        },
        attributes: ["id", "total", "status"],
        include: {
          model: this.OrderItem,
          attributes: ["id", "item_id", "qty", "price"],
          include: {
            model: this.Item,
            attributes: ["name"],
          },
        },
      });

      if (!order) {
        throw new this.ErrorResponse(
          400,
          "There is no orders",
        );
      }

      return res
        .status(200)
        .json(new this.ResponseFormat(200, order));
    } catch (error) {
      return next(error);
    }
  }

  /** create order json example
     * {
        "data":[{
            "order_id":0,
            "item_id":2,
            "qty":5,
            "price":8000
        },{
            "order_id":0,
            "item_id":7,
            "qty":3,
            "price":23000
        }]
        }
      */
  async createOrder(req, res, next) {
    try {
      const user_id = res.locals.userId;
      const orderItems = req.body.data;

      let total = 0;

      let order = await this.Order.create({
        user_id: user_id,
        total: total,
      });

      const order_id = order.id;

      orderItems.forEach((element) => {
        element.order_id = order_id;
        element.user_id = user_id;
        total += element.qty * element.price;
      });

      const orderItem = await this.OrderItem.bulkCreate(
        orderItems,
      );

      await this.Order.update(
        { total },
        {
          where: {
            id: order_id,
            user_id: user_id,
          },
        },
      );

      const getOrder = await this.Order.findOne({
        where: {
          user_id,
          id: order_id,
        },
        include: {
          model: this.OrderItem,
          attributes: ["id", "item_id", "qty", "price"],
          include: {
            model: this.Item,
            attributes: ["name", "stock"],
          },
        },
      });

      if (getOrder) {
        this.updateStock(getOrder, this.Item, false);
      }

      return res
        .status(201)
        .json(new this.ResponseFormat(201, getOrder));
    } catch (error) {
      return next(error);
    }
  }

  async updateOrder(req, res, next) {
    try {
      const {
        params: { id: order_id },
        body: { status },
      } = req;

      const user_id = res.locals.userId;

      let order = await this.Order.findOne({
        where: {
          id: order_id,
          user_id,
          status: "Pending",
        },
        include: [
          {
            model: this.OrderItem,
            attributes: ["id", "item_id", "qty", "price"],
            include: {
              model: this.Item,
              attributes: ["name", "stock"],
            },
          },
        ],
      });

      if (!order) {
        throw new this.ErrorResponse(
          404,
          `Order Not Found`,
        );
      }

      if (status === "Cancelled") {
        this.updateStock(order, this.Item, true);
      }

      await this.Order.update(
        { status },
        {
          where: {
            id: order_id,
            user_id,
          },
        },
      );

      return res
        .status(200)
        .json(new this.ResponseFormat(200, order));
    } catch (error) {
      return next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const {
        params: { id: order_id },
      } = req;
      const user_id = res.locals.userId;

      const order = await this.Order.findOne({
        where: {
          id: order_id,
          user_id,
          status: "Pending",
        },
        include: [
          {
            model: this.OrderItem,
            attributes: ["id", "item_id", "qty", "price"],
            include: {
              model: this.Item,
              attributes: ["name", "stock"],
            },
          },
        ],
      });

      // update stock item
      if (order) {
        this.updateStock(order, this.Item, true);
      }

      const orderUpdate = await this.Order.update(
        { status: "Cancelled" },
        {
          where: {
            id: order_id,
            user_id,
          },
        },
      );

      await this.OrderItem.destroy({
        where: {
          order_id: order_id,
        },
      });
      console.log("test6");
      await this.Order.destroy({
        where: {
          user_id,
          id: order_id,
        },
      });

      return res
        .status(200)
        .json(
          new this.ResponseFormat(200, "Order deleted"),
        );
    } catch (error) {
      return next(error);
    }
  }

  getOrders = this.getOrders.bind(this);
  createOrder = this.createOrder.bind(this);
  updateOrder = this.updateOrder.bind(this);
  deleteOrder = this.deleteOrder.bind(this);
}

module.exports = { OrderController };
