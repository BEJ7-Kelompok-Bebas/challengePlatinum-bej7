require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  Order,
  User,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

try {
  beforeAll(async () => {
    await sequelize.authenticate();
    await User.update(
      { role: "user" },
      { where: { id: 3 } },
    );
    await Order.update(
      { user_id: 2 },
      { where: { id: 1 } },
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Integration Testing: Order Controller", () => {
    afterEach(async () => {
      await Order.update(
        { status: "Pending", user_id: 3 },
        { where: { id: 3 } },
      );
    });

    describe("Integration Testing: updateOrder", () => {
      it("should return updated order, if request body status Complete", async () => {
        const token = await ModuleJwt.signToken(3);
        const orderId = 3;
        const resp = await request(app)
          .patch(`/api/v1/order/${orderId}/update`)
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({ status: "Complete" });

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("data");
        expect(resp.body.code).toBe(200);
        expect(resp.body.data).toBeTruthy();
      });

      it("should return updated order, if request body status Cancelled", async () => {
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

      it("should return Order Not Found, different user", async () => {
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

      it("should return error unhandled, req.body.status must be 'Cancelled','Complete','Pending'", async () => {
        const token = await ModuleJwt.signToken(3);
        const orderId = 3;
        const resp = await request(app)
          .patch(`/api/v1/order/${orderId}/update`)
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({ status: "cancelled" });

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(500);
        expect(resp.body.error).toBeTruthy();
      });
    });
  });
} catch (error) {
  console.log(error);
}
