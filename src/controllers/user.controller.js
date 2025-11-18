const StatusCodes = require("../utils/StatusCodes");
const uploadAvatarService = require("../services/user.service");

const uploadAvatar = async (req, res) => {
  const file = req.file.path;
  const user = req.user; //from middleware

  try {
    const response = await uploadAvatarService(file, user.user_id);

    return res.status(StatusCodes.OK).json({
      message: "Avatar uploaded successfully",
      data: response,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = uploadAvatar;
