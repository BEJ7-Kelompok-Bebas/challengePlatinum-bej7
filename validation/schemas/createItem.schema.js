const Joi = require("joi");

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required()
}).required()

module.exports = createItemSchema