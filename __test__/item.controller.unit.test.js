const { ItemController } = require("../controller");
const {
  ResponseFormat,
  ErrorResponse,
} = require("../helpers");
const {
  findOneBuyer,
  findOneAdmin,
  findOneNull,
} = require("../factories/user.factory");
const {
  findOneItem,
} = require("../factories/item.factory");

describe("Testing Item Controller", () => {
  describe("Testing: Get Item Function", () => {
    it("Should return the Item", (done) => {
      const mockReq = { item_id: 1 };

      const mockUser = {
        findOne: findOneNull,
      };

      const mockItem = {
        findOne: findOneItem,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
      );

      const mockRes = {};
      mockRes.status = jest.fn().mockReturnValue(mockRes);
      mockRes.status.json = jest
        .fn()
        .mockImplementation(
          (any) => new ResponseFormat(200, mockItem),
        );
      console.log(mockRes.status.json);

      const mockNext = jest
        .fn()
        .mockImplementation((err) => err);

      controller
        .getItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toHaveProperty("code");
          expect(resp).toHaveProperty("data");
          expect(resp.code).toBe(200);
          expect(resp.data).toBeTruthy();
        });
      done();
    });
  });
});
