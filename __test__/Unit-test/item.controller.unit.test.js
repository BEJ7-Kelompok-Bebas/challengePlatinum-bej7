const { ItemController } = require("../../controller");
const {
  ResponseFormat,
  ErrorResponse,
} = require("../../helpers");
const {
  findNull,
  findOneAdmin,
} = require("../../factories/user.factory");
const {
  destroyItemTrue,
  findOneItem,
  findAllItemQuerySort,
  findAllItemAutoSort,
  updateItem,
  dataAllItem,
  dataOneItem,
  sortedData,
} = require("../../factories/item.factory");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockValidate = jest.fn().mockReturnValue(true);

const mockNext = jest.fn().mockImplementation((err) => err);

const mockRes = mockResponse();

describe("Testing Item Controller", () => {
  describe("Testing: Get All Items", () => {
    it("should return All Items", (done) => {
      const mockReq = {
        query: {
          name: "item",
          sort: "price-A,stock-A",
          numericFilters: "price>1000",
        },
      };

      const mockUser = {
        findOne: findNull,
      };

      const mockItem = {
        findAll: findAllItemQuerySort,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
      );

      const mockData = dataAllItem;

      controller
        .getItems(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: mockData,
            error: {},
          });
        })
        .catch((err) => console.log("error", err));
      done();
    });

    it("should sort by created_at", (done) => {
      const mockReq = { query: { name: "item" } };

      const mockUser = {
        findOne: findNull,
      };

      const mockItem = {
        findAll: findAllItemAutoSort,
      };

      const mockData = sortedData;

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
      );

      controller
        .getItems(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: mockData,
            error: {},
          });
        })
        .catch((err) => console.log("error", err));
      done();
    });
  });

  describe("Testing: Get Item Function", () => {
    it("Should return the Item", (done) => {
      const mockReq = { params: { item_id: 1 } };

      const mockUser = {
        findOne: findNull,
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

      const mockData = dataOneItem;

      controller
        .getItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeDefined();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: mockData,
            error: {},
          });
        })
        .catch((err) => console.log("error", err));
      done();
    });
  });

  describe("Testing: Update Item Function", () => {
    it("should update item", (done) => {
      const mockReq = {
        params: { id: 1 },
        body: { price: 1000, stock: 10 },
      };

      mockUser = {};

      const mockRes = mockResponse();
      mockRes.locals = {
        userId: 1,
      };

      const mockItem = {
        findOne: findOneItem,
        update: updateItem,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
        mockValidate,
      );

      controller
        .updateItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: "Item Updated",
            error: {},
          });
        })
        .catch((err) => console.log("error", err));
      done();
    });
    //   it("should return Error Item Not Found", (done) => {});
  });

  describe("Testing: Delete Item Function", () => {
    it("should delete item", (done) => {
      mockReq = { params: { id: 1 } };

      const mockRes = mockResponse();
      mockRes.locals = { userId: 1 };

      mockUser = {
        findOne: findOneAdmin,
      };

      mockItem = {
        destroy: destroyItemTrue,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
        mockValidate,
      );

      controller
        .deleteItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeDefined();
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: "Item deleted",
            error: {},
          });
        })
        .catch((err) => console.log("error", err));
      done();
    });

    // it("should return Error Item Not Found", (done) => {});
  });
});
