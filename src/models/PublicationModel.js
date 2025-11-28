const mongoose = require("mongoose");
const {Schema} = mongoose
const { v4: uuidv4 } = require("uuid");

const PublicationSchema = new Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
    },
    abstract: {
      type: String,
      required: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Blockchain Security & Cryptography",
        "Digital Identity & Data Privacy",
        "Real Estate & Supply Chain",
        "Web3 Infrastructure & Interoperability",
        "AI & Blockchain Synergy",
        "Policy, Governance & Regulation",
        "General",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    file_url: {
      type: String,
      required: false,
    },
    content:{
      type: String,
      required: true,
    },
    cover_image_url: {
      type: String,
    },
    authors: [
      {
        user: { type: String, ref: "User" },
        name: { type: String },
      },
    ],
    team: {
      type: String,
      ref: "Team",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },

    // Who actually uploaded it (The Researcher/Intern)
    submitted_by: {
      type: String,
      ref: "User",
      required: true,
    },

    approved_by: {
      type: String,
      ref: "User",
    },

    publication_date: {
      type: Date,
      default: Date.now,
    },
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { _id: false, timestamps: true }
);

PublicationSchema.index({ status: 1, category: 1 });

PublicationSchema.index({ status: 1, publicationDate: -1 });

module.exports = mongoose.model("Publication", PublicationSchema);
