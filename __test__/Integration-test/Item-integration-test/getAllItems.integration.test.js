require("dotenv").config();

const request = require("supertest");
const app = require("../../../app");

const { sequelize } = require("../../../database/models");

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Integration Testing: Item Controller", () => {
  describe("Integration Testing: getItems Function", () => {
    it("should return Error No Items Found", async () => {
      const resp = await request(app)
        .get("/api/v1/item")
        .set("content-Type", "application/json")
        .set("Accept", "application/json")
        .query({
          numericFilters: "price<5000",
        })
        .send({});

      expect(resp.body).toHaveProperty("code");
      expect(resp.body).toHaveProperty("error");
      expect(resp.body.code).toBe(404);
      expect(resp.body.error).toEqual("No Items Found");
    });
  });
});
