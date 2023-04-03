const { Op } = require("sequelize");
const {
  createItemSchema,
} = require("../validation/schemas");

class ItemController {
  constructor(
    User,
    Item,
    ErrorResponse,
    ResponseFormat,
    validate,
  ) {
    this.User = User;
    this.Item = Item;
    this.ErrorResponse = ErrorResponse;
    this.ResponseFormat = ResponseFormat;
    this.validate = validate;
  }

  async getItems(req, res, next) {
    try {
      const { name, sort, numericFilters } = req.query;
      let queryObject = {};

      if (name) {
        queryObject.name = { [Op.like]: `%${name}%` };
      }

      // example ?numericFilters=price>1000,stock<20
      if (numericFilters) {
        const operatorMap = {
          ">": Op.gt,
          ">=": Op.gte,
          "=": Op.eq,
          "<": Op.lt,
          "<=": Op.lte,
        };
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        numericFilters.split(",").forEach((item) => {
          // qty>1
          const filter = item.replace(
            regEx,
            (match) => `_${match}_`,
          );
          //qty_>_1
          const filterSplit = filter.split("_");
          // {qty:{Op.gt:1}}
          queryObject[filterSplit[0]] = {
            [operatorMap[filterSplit[1]]]: filterSplit[2],
          };
        });
      }

      // example ?sort=price-A,stock-D
      let sortList = [];
      if (sort) {
        const map = {
          A: "ASC",
          D: "DESC",
        };
        const filter = sort.split(",").forEach((data) => {
          const [field, option] = data.split("-");
          sortList.push([field, map[option]]);
        });
      } else {
        sortList.push(["created_at", "ASC"]);
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      let items = await this.Item.findAll({
        where: {
          ...queryObject,
        },
        order: sortList,
        limit: limit,
        offset: skip,
        attributes: [
          "id",
          "name",
          "price",
          "stock",
          "image_url",
        ],
        include: {
          model: this.User,
          attributes: ["id", "username", "email"],
        },
      });

      if (items.length === 0) {
        throw new this.ErrorResponse(404, "No Items Found");
      }

      return res
        .status(200)
        .json(new this.ResponseFormat(200, items));
    } catch (error) {
      return next(error);
    }
  }

  async createItem(req, res, next) {
    try {
      const {
        body: { name, price, stock },
      } = req;
      const user_id = res.locals.userId;
      console.log("test1\n\n");
      await this.validate(createItemSchema, req.body);

      let item = await this.Item.findOne({
        where: {
          name,
        },
      });

      if (item) {
        throw new this.ErrorResponse(
          400,
          "Item Already Exist",
        );
      }

      item = await this.Item.create({
        user_id,
        name,
        price,
        stock,
        cloudinary_id: req.file.filename,
        image_url: req.file.path,
      });

      return res
        .status(201)
        .json(new this.ResponseFormat(201, item));
    } catch (error) {
      return next(error);
    }
  }

  async getItem(req, res, next) {
    try {
      const { id: item_id } = req.params;

      const item = await this.Item.findOne({
        where: {
          id: parseInt(item_id),
        },
        include: [
          {
            model: this.User,
            attributes: ["id", "username", "email"],
          },
        ],
      });

      return res
        .status(200)
        .json(new this.ResponseFormat(200, item));
    } catch (error) {
      return next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const {
        params: { id: item_id },
        body: { price, stock },
      } = req;
      const user_id = res.locals.userId;

      const updatedAttr = { price: price, stock: stock };

      let item = await this.Item.findOne({
        where: {
          id: item_id,
          user_id,
        },
      });

      if (!item) {
        throw new this.ErrorResponse(404, "Item Not Found");
      }

      await this.Item.update(
        { ...updatedAttr },
        {
          where: {
            id: item_id,
            user_id,
          },
        },
      );

      // item = await this.Item.findOne({
      //   where: {
      //     id: item_id,
      //     user_id,
      //   },
      // });

      return res
        .status(200)
        .json(new this.ResponseFormat(200, "Item Updated"));
    } catch (error) {
      return next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const {
        params: { id: item_id },
      } = req;
      const user_id = res.locals.userId;

      const item = await this.Item.destroy({
        where: {
          id: item_id,
          user_id,
        },
      });

      if (!item) {
        throw new this.ErrorResponse(404, "Item Not Found");
      }

      return res
        .status(200)
        .json(new this.ResponseFormat(200, "Item deleted"));
    } catch (error) {
      return next(error);
    }
  }
  getItem = this.getItem.bind(this);
  getItems = this.getItems.bind(this);
  createItem = this.createItem.bind(this);
  updateItem = this.updateItem.bind(this);
  deleteItem = this.deleteItem.bind(this);
}

module.exports = { ItemController };
