const cloudinary = require("../config/cloudinary");
const User = require("../models/UsersModel");
const { UpdateUserSchema } = require("../validation/userSchema");
const Publication = require("../models/PublicationModel");
const uploadAvatarService = async (file, user_id) => {
  try {
    const user = await User.findById(user_id);
    if (user?.avatar_public_id) {
      // delete previous avatar
      await cloudinary.uploader.destroy(user.avatar_public_id);
    }
    // upload avatar
    const result = await cloudinary.uploader.upload(file, {
      folder: "avatars",
      transformation: [{ width: 150, height: 150, crop: "fill" }],
    });

    // upload avatar url to user model
    await User.findByIdAndUpdate(user_id, {
      avatar_url: result.secure_url,
      avatar_public_id: result.public_id,
    });

    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    throw new Error(err.message);
  }
};

const getMe = async (user_id) => {
  try {
    const user = await User.findById(user_id).select("-hash");
    if (!user) {
      return new Error("User not found");
    }
    const { _id, avatar_public_id, __v, ...userData } = user.toObject();

    return userData;
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
};

const updateUser = async (payload, user_id) => {
  try {
    // check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return new Error("User not found");
    }

    // update user and return updated object without sensitive fields
    const updated = await User.findByIdAndUpdate(
      user_id,
      {
        first_name: payload?.first_name || user.first_name,
        last_name: payload?.last_name || user.last_name,
        phone_number: payload?.phone_number || user.phone_number,
      },
      { new: true }
    );

    const { _id, avatar_public_id, __v, hash, ...userData } =
      updated.toObject();
    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPublications = async () => {
  try {
    const Publications = await Publication.find({ status: "PUBLISHED" });
    if (Publications.length == 0) {
      return new Error("No publications found");
    }
    return Publications;
  } catch (error) {
    console.log("Error: ", error);
    throw new Error(error.message);
  }
};

module.exports = { uploadAvatarService, getMe, updateUser, getPublications };
