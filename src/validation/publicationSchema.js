const Joi = require("joi");

const createResearchSchema = Joi.object({
  title: Joi.string().trim().required(),
  slug: Joi.string().lowercase().optional(),

  abstract: Joi.string().max(500).required(),

  category: Joi.string()
    .valid(
      "Blockchain Security & Cryptography",
      "Digital Identity & Data Privacy",
      "Real Estate & Supply Chain",
      "Web3 Infrastructure & Interoperability",
      "AI & Blockchain Synergy",
      "Policy, Governance & Regulation",
      "General"
    )
    .required(),

  tags: Joi.array().items(Joi.string().trim()),

  file_url: Joi.string().uri().optional(),

  content: Joi.string().required(),

  cover_image_url: Joi.string().uri().optional(),

  authors: Joi.array().items(
    Joi.object({
      user: Joi.string().optional(), // later you can manually validate ObjectId
      name: Joi.string().optional(),
    })
  ),

  team: Joi.string().optional(), // left as simple string
});

module.exports = createResearchSchema;
