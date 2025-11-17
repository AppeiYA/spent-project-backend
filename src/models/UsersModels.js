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
      required: true,
    },
    last_name: {
      type: String,
      required: true,
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
  },
  { _id: false, timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
