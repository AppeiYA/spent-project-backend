const User = require("../models/UsersModel");
const bcrypt = require("bcrypt");

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

module.exports = { registerUser };
