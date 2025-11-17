const Joi = require("joi");

const RegisterUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("user", "researcher", "editor").optional()
});

module.exports = { RegisterUserSchema };
