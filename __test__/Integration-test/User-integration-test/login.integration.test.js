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
  describe("Integration Testing: login", () => {
    test("should return accessToken", async () => {
      const resp = await request(app)
        .post("/api/v1/user/login")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "admin1@gmail.com",
          password: "12345678",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.data).toHaveProperty("accessToken");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data.accessToken).toBeTruthy();
    });

    test("should return Invalid Credential, given wrong email", async () => {
      const resp = await request(app)
        .post("/api/v1/user/login")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "admin3@gmail.com",
          password: "12345678",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(401);
      expect(resp.body.error).toEqual("Invalid Credential");
    });

    test("should return Invalid Credential, given wrong password", async () => {
      const resp = await request(app)
        .post("/api/v1/user/login")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "admin1@gmail.com",
          password: "12345668",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(401);
      expect(resp.body.error).toEqual("Invalid Credential");
    });
  });
});
