const Joi = require("joi");

const phoneRegex = /^\+?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const UpdateUserSchema = Joi.object({
    first_name: Joi.string().max(24).optional(),
    last_name: Joi.string().max(24).optional(),
    phone_number: Joi.string().pattern(phoneRegex).optional()
}).or("first_name", "last_name", "phone_number")

module.exports = {UpdateUserSchema}