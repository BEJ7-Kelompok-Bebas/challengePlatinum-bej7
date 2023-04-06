const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().min(6),
  password: Joi.string().min(8).required(),
  role: Joi.string(),
}).required();

module.exports = { loginSchema };
