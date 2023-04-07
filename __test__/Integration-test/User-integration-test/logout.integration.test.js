require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  User,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

try {
  let refresh_token;
  let token;

  beforeAll(async () => {
    await sequelize.authenticate();
    refresh_token = await ModuleJwt.signRefreshToken(1);
    token = await ModuleJwt.signToken(1);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Integration Testing: User Controller", () => {
    describe("Integration Testing: logout", () => {
      it("should return User logged out, if everything correct", async () => {
        const user = await User.findOne({
          where: { id: 1 },
          attributes: ["id", "refresh_token"],
        });
        user.refresh_token = refresh_token;
        await user.save();

        const resp = await request(app)
          .get("/api/v1/user/logout")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Cookie", `jwt=${refresh_token}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("data");
        expect(resp.body.data).toHaveProperty("message");
        expect(resp.body.code).toBe(200);
        expect(resp.body.data.message).toEqual(
          "User logged out",
        );
      });

      it("should return Error User Not Found", async () => {
        const user = await User.findOne({
          where: { id: 1 },
          attributes: ["id", "refresh_token"],
        });
        user.refresh_token = null;
        await user.save();

        const resp = await request(app)
          .get("/api/v1/user/logout")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Cookie", `jwt=${refresh_token}`)
          .set("Authorization", `Bearer ${token}`);

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(404);
        expect(resp.body.error).toEqual("User Not Found");
      });

      it("should return User logged out, if no cookie", async () => {
        const user = await User.findOne({
          where: { id: 1 },
          attributes: ["id", "refresh_token"],
        });
        user.refresh_token = refresh_token;
        await user.save();
        const resp = await request(app)
          .get("/api/v1/user/logout")
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("data");
        expect(resp.body.data).toHaveProperty("message");
        expect(resp.body.code).toBe(200);
        expect(resp.body.data.message).toEqual(
          "User logged out",
        );
      });
    });
  });
} catch (error) {
  console.log(error);
}
