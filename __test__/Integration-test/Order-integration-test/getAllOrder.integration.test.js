require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  User,
  Order,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

try {
  beforeAll(async () => {
    await sequelize.authenticate();
    await User.update(
      { role: "user" },
      { where: { id: 2 } },
    );
    await Order.update(
      { status: "Complete", user_id: 2 },
      { where: { id: 1 } },
    );
    await Order.update(
      { user_id: 3 },
      { where: { id: 3 } },
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Integration Testing: Order Controller", () => {
    describe("Integration Testing: getAllOrders", () => {
      it("should return All Order with order id 1", async () => {
        const token = await ModuleJwt.signToken(2);
        const resp = await request(app)
          .get("/api/v1/order/")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .query({
            order_id: 1,
          });

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("data");
        expect(resp.body.code).toBe(200);
        expect(resp.body.data).toBeTruthy();
      });

      it("should return All Order with order status Complete", async () => {
        const token = await ModuleJwt.signToken(2);
        const resp = await request(app)
          .get("/api/v1/order/")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .query({
            status: "Complete",
          });

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("data");
        expect(resp.body.code).toBe(200);
        expect(resp.body.data).toBeTruthy();
      });

      it("should return Error There is no orders", async () => {
        const token = await ModuleJwt.signToken(2);
        const resp = await request(app)
          .get("/api/v1/order/")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .query({
            order_id: 3,
          });

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(400);
        expect(resp.body.error).toEqual(
          "There is no orders",
        );
      });
    });
  });
} catch (error) {
  console.log(error);
}
