const { registerUser, loginUser } = require("../services/auth.service");
const StatusCodes = require("../utils/StatusCodes");
const {
  RegisterUserSchema,
  LoginUserSchema,
} = require("../validation/authSchema");

const register = async (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is missing",
    });
  }

  const { error, value } = RegisterUserSchema.validate(req.body);

  
  try {
    const response = await registerUser(value);

    if (response instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: response.message,
      });
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }

  return res.status(StatusCodes.OK).json({
    message: "User Registered Successfully",
  });
};

const login = async (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is missing",
    });
  }

  const { error, value } = LoginUserSchema.validate(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.details[0].message,
    });
  }

  try {
    const response = await loginUser(value);

    if (response instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: response.message,
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Login Successfull",
      data: response,
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

module.exports = {register, login};
