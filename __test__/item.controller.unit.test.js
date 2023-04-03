const { ItemController } = require("../controller");
const {
  ResponseFormat,
  ErrorResponse,
} = require("../helpers");
const {
  findOneBuyer,
  findOneAdmin,
  findNull,
} = require("../factories/user.factory");
const {
  findOneItem,
  findAllItem,
  dataAllItem,
  dataOneItem,
  updateItem,
  sortedItem,
  findAllItemAutoSort,
  findAllItemQuerySort,
  destroyItemTrue,
} = require("../factories/item.factory");
const { validate } = require("../middleware");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn().mockImplementation((err) => err);

const mockRes = mockResponse();

describe("Testing Item Controller", () => {
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
        validate,
      );

      const mockData = dataOneItem;

      controller
        .getItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: mockData,
          });
        });
      done();
    });
  });

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
        validate,
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
          });
        });
      done();
    });

    // it("should return Error No Items Found", (done) => {
    //   const mockReq = {
    //     query: {
    //       name: "item",
    //       sort: "price-A,stock-A",
    //       numericFilters: "price>1000",
    //     },
    //   };

    //   const mockUser = {
    //     findOne: findNull,
    //   };

    //   const mockItem = {
    //     findAll: findNull,
    //   };

    //   const mockData = {};

    //   const controller = new ItemController(
    //     mockUser,
    //     mockItem,
    //     ErrorResponse,
    //     ResponseFormat,
    //   );

    //   controller
    //     .getItems(mockReq, mockRes, mockNext)
    //     .then((resp) => {
    //       expect(resp).toBeTruthy();
    //       expect(resp).toHaveProperty("code");
    //       expect(resp.status).toHaveBeenCalledWith(404);
    //       expect(resp.json).toHaveBeenCalledWith({
    //         code: 404,
    //         error: "No Items Found",
    //       });
    //     });
    //   done();
    // });

    it("should sort by created_at", (done) => {
      const mockReq = { query: { name: "item" } };

      const mockUser = {
        findOne: findNull,
      };

      const mockData = sortedItem;

      const mockItem = {
        findAll: findAllItemAutoSort,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
        validate,
      );

      controller
        .getItems(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: mockData,
          });
        });
      done();
    });
  });

  // describe("Testing: Create Item Function", () => {
  //   it("should create item", (done) => {
  //     mockReq = {
  //       body: {
  //         name: "item10",
  //         price: 5000,
  //         stock: 10,
  //       },
  //     };

  //     const mockRes = mockResponse();
  //     mockRes.locals = { userId: 1 };

  //     const mockItem = {
  //       findOne: findNull,
  //       create:
  //     };
  //   });
  // });

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
        validate,
      );

      controller
        .updateItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: "Item Updated",
          });
        });
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
        findOne: findNull,
      };

      mockItem = {
        destroy: destroyItemTrue,
      };

      const controller = new ItemController(
        mockUser,
        mockItem,
        ErrorResponse,
        ResponseFormat,
        validate,
      );

      controller
        .deleteItem(mockReq, mockRes, mockNext)
        .then((resp) => {
          expect(resp).toBeTruthy();
          expect(resp.status).toHaveBeenCalledWith(200);
          expect(resp.json).toHaveBeenCalledWith({
            code: 200,
            data: "Item deleted",
          });
        });
      done();
    });

    //   it("should return Error Item Not Found", (done) => {});
  });
});
