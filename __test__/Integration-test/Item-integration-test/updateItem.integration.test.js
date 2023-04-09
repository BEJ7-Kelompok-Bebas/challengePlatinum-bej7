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
    await Item.update({ user_id: 1 }, { where: { id: 5 } });
    await User.update(
      { role: "admin" },
      { where: { id: 1 } },
    );
    await User.update(
      { role: "user" },
      { where: { id: 2 } },
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("Integration Testing: Item Controller", () => {
    describe("Integration Testing: updateItem Function", () => {
      it("should return Error Item Not Found", async () => {
        const token = await ModuleJwt.signToken(1); //user 1 token (admin role)
        const idParams = 6;
        const resp = await request(app)
          .patch(`/api/v1/item/${idParams}`)
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({ price: 1000 });

        //   console.log(resp);
        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(404);
        expect(resp.body.error).toEqual("Item Not Found");
      });

      it("should return Error Forbidden", async () => {
        const token = await ModuleJwt.signToken(2); //user 2 token (user role)
        const idParams = 5;
        const resp = await request(app)
          .patch(`/api/v1/item/${idParams}`)
          .set("content-Type", "application/json")
          .set("Accept", "application/json")
          .set("Authorization", `Bearer ${token}`)
          .send({ price: 1000 });

        //   console.log(resp);
        expect(resp.body).toHaveProperty("code");
        expect(resp.body).toHaveProperty("error");
        expect(resp.body.code).toBe(403);
        expect(resp.body.error).toEqual("Forbidden");
      });
    });
  });
} catch (error) {
  console.log(error);
}
