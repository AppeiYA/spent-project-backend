const { required } = require("joi");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "researcher", "user"],
      default: "user",
    },
    phone_number: {
      type: String,
      required: false,
    },
    avatar_url: {
      type: String,
      required: false,
    },
    avatar_public_id: {
      type: String,
      required: false,
    }
  },
  { _id: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
