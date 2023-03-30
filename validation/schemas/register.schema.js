const Joi = require("joi");
const userRole =
  require("../../middleware/authorization").userRole;

const registerSchema = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().min(8).required(),
  username: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(userRole))
    .required(),
  address: Joi.string(),
  phone: Joi.string(),
}).required();

module.exports = { registerSchema };
