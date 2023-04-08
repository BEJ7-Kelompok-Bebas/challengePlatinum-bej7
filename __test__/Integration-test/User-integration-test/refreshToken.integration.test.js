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
  const refresh_token = await ModuleJwt.signRefreshToken(1);
  await User.update(
    { refresh_token },
    { where: { id: 1 } },
  );
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: User Controller", () => {
  describe("Integration Testing: refreshToken", () => {
    it("should return accessToken", async () => {
      const user = await User.findOne({
        where: { id: 1 },
        attributes: ["refresh_token"],
      });
      const refresh_token = user.refresh_token;

      console.log("refresh", refresh_token);
      const resp = await request(app)
        .get("/api/v1/user/refresh-token")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Cookie", `jwt=${refresh_token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("data");
      expect(resp.body.data).toHaveProperty("accessToken");
      expect(resp.body.code).toBe(200);
      expect(resp.body.data.accessToken).toBeTruthy();
    });

    it("should return error Unauthorized", async () => {
      const refresh_token = "";

      console.log("refresh", refresh_token);
      const resp = await request(app)
        .get("/api/v1/user/refresh-token")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Cookie", `jwt=${refresh_token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(401);
      expect(resp.body.error).toEqual("Unauthorized");
    });

    it("should return error Forbidden", async () => {
      const refresh_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.sp3k-Xf-Um4tKxTMNnJ777_q43IyaN17TyS0-pzAaIY";

      console.log("refresh", refresh_token);
      const resp = await request(app)
        .get("/api/v1/user/refresh-token")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .set("Cookie", `jwt=${refresh_token}`);

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(403);
      expect(resp.body.error).toEqual("Forbidden");
    });

    // it("should return error Forbidden", async () => {
    //   const refresh_token =

    //   console.log("refresh", refresh_token);
    //   const resp = await request(app)
    //     .get("/api/v1/user/refresh-token")
    //     .set("content-Type", "application/json")
    //     .set("Accept", "application/json")
    //     .set("Cookie", `jwt=${refresh_token}`);

    //   expect(resp.body).toHaveProperty("code");
    //   expect(resp.body).toHaveProperty("error");
    //   expect(resp.body.code).toBe(403);
    //   expect(resp.body.error).toEqual("Forbidden");
    // });
  });
});
