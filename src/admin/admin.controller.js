const StatusCodes = require("../utils/StatusCodes");
const { getUsers, approveUser } = require("./admin.service");

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
    console.log("Error: ", err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error"
    })
  }
};

module.exports = { adminGetUsers, adminApproveUser };
