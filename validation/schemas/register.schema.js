const Joi = require("joi");
const UserRole =
  require("../../middleware/authorization").UserRole;

const registerSchema = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().min(8).required(),
  username: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required(),
  address: Joi.string(),
  phone: Joi.string(),
}).required();

module.exports = { registerSchema };
