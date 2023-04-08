require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const { sequelize } = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: Order Controller", () => {
  describe("Integration Testing: createOrder", () => {
    it("should create new order", async () => {
      const token = await ModuleJwt.signToken(2);
      const resp = await request(app)
        .post("/api/v1/order")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          data: [
            {
              item_id: 2,
              qty: 5,
              price: 8000,
            },
            {
              item_id: 5,
              qty: 3,
              price: 5000,
            },
          ],
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(201);
      expect(resp.body.data).toBeTruthy();
    });
    it("should return error Item can't be ordered", async () => {
      const token = await ModuleJwt.signToken(2);
      const resp = await request(app)
        .post("/api/v1/order")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          data: [
            {
              item_id: 10,
              qty: 5,
              price: 8000,
            },
            {
              item_id: 5,
              qty: 3,
              price: 5000,
            },
          ],
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(404);
      expect(resp.body.error).toEqual(
        "Item can't be ordered",
      );
    });

    it("should return error Forbidden, given role is admin", async () => {
      const token = await ModuleJwt.signToken(1);
      const resp = await request(app)
        .post("/api/v1/order")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          data: [
            {
              item_id: 10,
              qty: 5,
              price: 8000,
            },
            {
              item_id: 5,
              qty: 3,
              price: 5000,
            },
          ],
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(403);
      expect(resp.body.error).toEqual("Forbidden");
    });

    it("should return error Unauthorized, given no token", async () => {
      const resp = await request(app)
        .post("/api/v1/order")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          data: [
            {
              item_id: 10,
              qty: 5,
              price: 8000,
            },
            {
              item_id: 5,
              qty: 3,
              price: 5000,
            },
          ],
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(401);
      expect(resp.body.error).toEqual("Unauthorized");
    });

    it("should return error Unauthorized, given random token with different secretkey", async () => {
      const token = await jwt.sign(
        { user_id: 1 },
        "diffkey",
        { expiresIn: "1d" },
      );
      const resp = await request(app)
        .post("/api/v1/order")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send({
          data: [
            {
              item_id: 10,
              qty: 5,
              price: 8000,
            },
            {
              item_id: 5,
              qty: 3,
              price: 5000,
            },
          ],
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(401);
      expect(resp.body.error).toEqual("Unauthorized");
    });
  });
});
