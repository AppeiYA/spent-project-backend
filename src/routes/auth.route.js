const express = require("express");
const StatusCodes = require("../utils/StatusCodes");
const register = require("../controllers/auth.controller");

const authRouter = express.Router();

// request : /api/auth/register
authRouter.post("/register", register);

module.exports = authRouter;
