const cloudinary = require("../config/cloudinary");
const User = require("../models/UsersModel")
const uploadAvatarService = async (file, user_id) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "avatars",
      transformation: [{ width: 150, height: 150, crop: "fill" }],
    });

    // upload avatar url to user model
    await User.findByIdAndUpdate(user_id, { avatar_url: result.secure_url});

    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {uploadAvatarService}