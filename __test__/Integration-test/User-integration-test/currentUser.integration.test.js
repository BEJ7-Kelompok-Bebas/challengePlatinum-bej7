require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const { sequelize } = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: User Controller", () => {
  describe("Integration Testing: refreshToken", () => {
    it("should return current user", async () => {
      const token = await ModuleJwt.signToken(1);
      const resp = await request(app)
        .get("/api/v1/user/current-user")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data).toBeTruthy();
    });

    it("should return error not found", async () => {
      const token = await ModuleJwt.signToken(10000);
      const resp = await request(app)
        .get("/api/v1/user/current-user")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(404);
      expect(resp.body.error).toEqual("Not found");
    });
  });
});
