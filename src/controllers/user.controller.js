const StatusCodes = require("../utils/StatusCodes");
const {
  uploadAvatarService,
  getMe,
  updateUser,
  getPublications,
} = require("../services/user.service");
const { UpdateUserSchema } = require("../validation/userSchema");

const uploadAvatar = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "No file uploaded",
    });
  }
  const filePath = file.path;
  const user = req.user; //from middleware

  try {
    const response = await uploadAvatarService(filePath, user.user_id);

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

const getProfile = async (req, res) => {
  const user = req.user;
  try {
    const resp = await getMe(user.user_id);
    if (resp instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: resp.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "User fetched successfully",
      data: resp,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const user = req.user;
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is missing",
    });
  }
  const { error, value } = UpdateUserSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }

  try {
    const response = await updateUser(req.body, user.user_id);
    if (response instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "User update successfully",
      data: response,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "failed to update user",
    });
  }
};

const GetPublications = async (_req, res) => {
  try {
    const response = await getPublications();
    if (response instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No publications found",
        data: []
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Publications fetched success",
      data: response,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

module.exports = { uploadAvatar, getProfile, updateProfile, GetPublications };
