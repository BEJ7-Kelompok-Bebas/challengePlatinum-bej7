require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const {
  sequelize,
  Item,
  User,
} = require("../../../database/models");
const { ModuleJwt } = require("../../../modules");

try {
  beforeAll(async () => {
    await sequelize.authenticate();
    await Item.destroy({ where: { id: 6 } });
    await User.update(
      { role: "admin" },
      { where: { id: 1 } },
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Testing Item Controller", () => {
    describe("Testing Integration: deleteItem", () => {
      it("should return Error Item Not Found", async () => {
        const token = await ModuleJwt.signToken(1); //user 1 token (admin role)
        const idParams = 6;
        const resp = await request(app)
          .delete(`/api/v1/item/${idParams}`)
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`);

        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(404);
        expect(resp.body.error).toEqual("Item Not Found");
      });
    });
  });
} catch (error) {
  console.log(error);
}
