class ItemController {
  constructor(
    User,
    Item,
    ErrorResponse,
    ResponseFormat,
    validate,
    createItemSchema,
    Op,
  ) {
    this.User = User;
    this.Item = Item;
    this.ErrorResponse = ErrorResponse;
    this.ResponseFormat = ResponseFormat;
    this.validate = validate;
    this.createItemSchema = createItemSchema;
    this.Op = Op;
  }

  async getItems(req, res, next) {
    try {
      const { name, sort, numericFilters } = req.query;
      let queryObject = {};

      if (name) {
        queryObject.name = { [this.Op.like]: `%${name}%` };
      }

      // example ?numericFilters=price>1000,stock<20
      if (numericFilters) {
        const operatorMap = {
          ">": this.Op.gt,
          ">=": this.Op.gte,
          "=": this.Op.eq,
          "<": this.Op.lt,
          "<=": this.Op.lte,
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
        attributes: ["id", "name", "price", "stock"],
        include: {
          model: this.User,
          attributes: ["id", "username", "email"],
        },
      });

      if (items.length === 0) {
        throw new this.ErrorResponse(404, "No Items Found");
      }

      return new this.ResponseFormat(res, 200, items);
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

      await this.validate(this.createItemSchema, req.body);

      const item = await this.Item.create({
        user_id,
        name,
        price,
        stock,
      });

      return new this.ResponseFormat(res, 201, item);
    } catch (error) {
      return next(error);
    }
  }

  async getItem(req, res, next) {
    try {
      const { id: item_id } = req.params;

      const item = await this.Item.findAll({
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

      return new this.ResponseFormat(res, 200, item);
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

      // item = await Item.findOne({
      //     where:{
      //         id: item_id,
      //         user_id
      //     }
      // })

      return new this.ResponseFormat(res, 200, item);
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

      return new this.ResponseFormat(
        res,
        200,
        "Item deleted",
      );
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
