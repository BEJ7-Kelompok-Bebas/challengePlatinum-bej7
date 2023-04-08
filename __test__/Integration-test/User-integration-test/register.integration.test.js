require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  User,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

try {
  beforeAll(async () => {
    await sequelize.authenticate();
    await User.destroy({
      where: {
        email: "random@ymail.com",
      },
    });
    await User.destroy({ where: { username: "random" } });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Integration Testing: User Controller", () => {
    describe("Integration Testing: Register", () => {
      afterEach(async () => {
        await User.destroy({
          where: {
            email: "random@ymail.com",
          },
        });
        await User.destroy({
          where: { username: "random" },
        });
      });

      it("should return User created", async () => {
        const resp = await request(app)
          .post("/api/v1/user/register")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .send({
            email: "random@ymail.com",
            username: "random",
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
          email: "random@ymail.com",
          username: "test888",
          password: "12345678",
          role: "user",
        });

        const resp = await request(app)
          .post("/api/v1/user/register")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .send({
            email: "random@ymail.com",
            username: "random",
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
          email: "random@live.com",
          username: "random",
          password: "12345678",
          role: "user",
        });

        const resp = await request(app)
          .post("/api/v1/user/register")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .send({
            email: "random@ymail.com",
            username: "random",
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
} catch (error) {
  console.log(error);
}
