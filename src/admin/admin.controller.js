const StatusCodes = require("../utils/StatusCodes");
const createResearchSchema = require("../validation/publicationSchema");
const {
  getUsers,
  approveUser,
  createResearchPublication,
} = require("./admin.service");

const adminGetUsers = async (req, res) => {
  try {
    const response = await getUsers();
    if (response instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No users found",
        data: [],
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Users fetched successfully",
      data: response,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Internal server error",
    });
  }
};

const adminApproveUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await approveUser(user_id);
    if (response instanceof Error) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "User approved",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

const createPublication = async (req, res) => {
  const user = req.user;
  const file = req.file;

  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is missing",
    });
  }
  const { error, value } = createResearchSchema.validate(req.body);
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }
  var payload = value;
  payload.submitted_by = user.user_id;

  try {
    const response = await createResearchPublication(file, value);
    if (response instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Publication created successfully",
      data: response,
    })
  } catch (err) {
    console.log("Error: ", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = { adminGetUsers, adminApproveUser, createPublication };
