require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  Order,
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
    await Order.update(
      { status: "Pending" },
      { where: { id: 3 } },
    );
  });

  describe("Integration Testing: updateOrder", () => {
    it("should return updated order", async () => {
      const token = await ModuleJwt.signToken(3);
      const orderId = 3;
      const resp = await request(app)
        .patch(`/api/v1/order/${orderId}/update`)
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data).toBeTruthy();
    });

    it("should return updated order", async () => {
      const token = await ModuleJwt.signToken(3);
      const orderId = 3;
      const resp = await request(app)
        .patch(`/api/v1/order/${orderId}/update`)
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "Cancelled" });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data).toBeTruthy();
    });

    it("should return updated order", async () => {
      const token = await ModuleJwt.signToken(3);
      const orderId = 1;
      const resp = await request(app)
        .patch(`/api/v1/order/${orderId}/update`)
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "Cancelled" });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(404);
      expect(resp.body.error).toEqual("Order Not Found");
    });
  });
});
