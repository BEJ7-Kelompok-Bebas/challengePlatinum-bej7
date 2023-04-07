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
    await User.destroy({ where: { id: 4 } });
  });

  afterAll(async () => {
    await User.update(
      { deleted_at: null },
      { where: { id: 4 }, paranoid: false },
    );
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
        const token = await ModuleJwt.signToken(4);
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
} catch (error) {
  console.log(error);
}
