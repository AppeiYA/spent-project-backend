const express = require("express");
const { login } = require("../controllers/auth.controller");
const adminRouter = express.Router();
const authAdminMiddleware = require("../middleware/authAdminMiddleware");
const { adminGetUsers, adminApproveUser } = require("./admin.controller");

// admin login
adminRouter.post("/login", login);

// get users (pending, banned and approved)
adminRouter.get("/users", authAdminMiddleware, adminGetUsers);

adminRouter.patch("/users/:user_id", authAdminMiddleware, adminApproveUser);

module.exports = adminRouter;
