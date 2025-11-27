const User = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const StatusCodes = require("../utils/StatusCodes");

const registerUser = async (RegisterUserData) => {
  try {
    const existingUser = await User.findOne({ email: RegisterUserData?.email });
    if (existingUser) {
      return new Error("User with email already exists");
    }
    // hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(
      RegisterUserData?.password,
      saltRounds
    );

    await User.create({
      first_name: RegisterUserData?.first_name,
      last_name: RegisterUserData?.last_name,
      email: RegisterUserData?.email,
      hash: passwordHash,
      role: RegisterUserData?.role || "user",
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (LoginUserData) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: LoginUserData?.email });
    if (!user) {
      return new Error("User not found");
    }
    if (["pending", "banned"].includes(user.status) && user.role != "admin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "User not yet approved by admin",
      });
    }
    // compare password
    const isPasswordValid = await bcrypt.compare(
      LoginUserData?.password,
      user.hash
    );
    if (!isPasswordValid) {
      return new Error("Invalid password");
    }

    // generate token
    const token = await jwt.sign(
      { user_id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return {
      user: {
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
      },
      token: token,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { registerUser, loginUser };
