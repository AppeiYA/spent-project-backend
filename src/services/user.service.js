const cloudinary = require("../config/cloudinary");
const User = require("../models/UsersModel");
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

module.exports = { uploadAvatarService };
