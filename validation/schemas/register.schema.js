const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().min(8).required(),
  username: Joi.string(),
  role: Joi.string().required(),
  address: Joi.string(),
  phone: Joi.string(),
}).required();

module.exports = { registerSchema };
