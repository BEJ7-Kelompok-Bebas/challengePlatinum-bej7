const Joi = require('joi')

const registerSchema = Joi.object({
    email: Joi.string().email().required().min(6),
    password: Joi.string().min(8).required(),
    username: Joi.string().min(3).required(),
    address: Joi.string(),
    phone: Joi.string().required().min(12)
}).required()

module.exports = {registerSchema}