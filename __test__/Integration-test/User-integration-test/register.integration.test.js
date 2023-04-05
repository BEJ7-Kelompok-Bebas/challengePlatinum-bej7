require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  User,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

beforeAll(async () => {
  await sequelize.authenticate();
  await User.destroy({
    where: {
      email: "achristofer@ymail.com",
    },
  });
  await User.destroy({ where: { username: "chris" } });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: User Controller", () => {
  describe("Integration Testing: Register", () => {
    afterEach(async () => {
      await User.destroy({
        where: {
          email: "achristofer@ymail.com",
        },
      });
      await User.destroy({ where: { username: "chris" } });
    });

    it("should return User created", async () => {
      const resp = await request(app)
        .post("/api/v1/user/register")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "achristofer@ymail.com",
          username: "chris",
          password: "12345678",
          role: "user",
          address: "indo",
          phone: "00000000000",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.code).toBe(201);
      expect(resp.body.data).toEqual("User created");
    });

    it("should return Email already exist", async () => {
      await User.create({
        email: "achristofer@ymail.com",
        username: "test888",
        password: "12345678",
        role: "user",
      });

      const resp = await request(app)
        .post("/api/v1/user/register")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "achristofer@ymail.com",
          username: "chris",
          password: "12345678",
          role: "user",
          address: "indo",
          phone: "00000000000",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(400);
      expect(resp.body.error).toEqual(
        "Email already exist",
      );
    });

    it("should return Username already exist", async () => {
      await User.create({
        email: "achristofer@live.com",
        username: "chris",
        password: "12345678",
        role: "user",
      });

      const resp = await request(app)
        .post("/api/v1/user/register")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .send({
          email: "achristofer@ymail.com",
          username: "chris",
          password: "12345678",
          role: "user",
          address: "indo",
          phone: "00000000000",
        });

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(400);
      expect(resp.body.error).toEqual(
        "Username already exist",
      );
    });
  });
});
