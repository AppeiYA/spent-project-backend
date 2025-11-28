const User = require("../models/UsersModel");
const cloudinary = require("../config/cloudinary");
const Publication = require("../models/PublicationModel")
const getUsers = async () => {
  try {
    const users = await User.find().select("-hash -__v -avatar_public_id");
    if (users.length == 0) {
      return new Error("No users found");
    }
    return users;
  } catch (err) {
    console.log("Error: ", err);
    throw new Error(err.message);
  }
};

const approveUser = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return new Error("User not found");
    }

    // approve user
    await User.findByIdAndUpdate(user_id, {
      status: "approved",
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const createResearchPublication = async (file, payload) => {
  try {
    var fileUrl = "";
    if (!file) {
      fileUrl = "https://placehold.co/600x400";
    } else {
      const result = await cloudinary.uploader.upload(file, {
        folder: "publications",
        transformation: [{ width: 150, height: 150, crop: "fill" }],
      });
      fileUrl = result.secure_url;
    }

    const newPublication = await Publication.create({
      ...payload,
      cover_image_url: fileUrl
    })

    return newPublication.toObject();
  } catch (err) {
    console.log("Error:", err)
    return new Error(err.message)
  }
};

module.exports = { getUsers, approveUser, createResearchPublication };
