const express = require("express");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/users.route");
const appRouter = express.Router();

// request: /api/auth
appRouter.use("/auth", authRouter)

// request: /api/users
appRouter.use("/users", userRouter)

module.exports = appRouter;