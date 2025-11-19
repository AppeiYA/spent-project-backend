const express = require("express");
const StatusCodes = require("../utils/StatusCodes");
const { register, login } = require("../controllers/auth.controller");

const authRouter = express.Router();

// request : /api/auth/register
authRouter.post("/register", register);
// request: /api/auth/login
authRouter.post("/login", login);

module.exports = authRouter;
