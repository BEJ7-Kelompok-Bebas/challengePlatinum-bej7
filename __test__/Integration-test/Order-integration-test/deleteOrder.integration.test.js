require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  Order,
  OrderItem,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: Order Controller", () => {
  afterEach(async () => {
    const order = await Order.update(
      { status: "Pending", deleted_at: null },
      {
        where: { id: 3 },
        paranoid: false,
      },
    );

    const orderItem = await OrderItem.update(
      { deleted_at: null },
      {
        where: { order_id: 3 },
        paranoid: false,
      },
    );
  });

  describe("Integration Testing: deleteOrder", () => {
    it("should delete the order", async () => {
      const token = await ModuleJwt.signToken(3);
      const orderId = 3;
      const resp = await request(app)
        .delete(`/api/v1/order/${orderId}`)
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data).toBeTruthy();
    });

    it("should return error Order Not Found", async () => {
      const token = await ModuleJwt.signToken(3);
      const orderId = 1;
      const resp = await request(app)
        .delete(`/api/v1/order/${orderId}`)
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(404);
      expect(resp.body.error).toEqual("Order Not Found");
    });
  });
});
