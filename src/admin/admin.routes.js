const express = require("express");
const { login } = require("../controllers/auth.controller");
const adminRouter = express.Router();
const authAdminMiddleware = require("../middleware/authAdminMiddleware");
const {
  adminGetUsers,
  adminApproveUser,
  createPublication,
} = require("./admin.controller");
const upload = require("../middleware/multer");

// admin login
adminRouter.post("/login", login);

// get users (pending, banned and approved)
adminRouter.get("/users", authAdminMiddleware, adminGetUsers);

adminRouter.patch(
  "/users/:user_id/approve",
  authAdminMiddleware,
  adminApproveUser
);

adminRouter.post(
  "/publications",
  authAdminMiddleware,
  upload.single("cover_image"),
  createPublication
);

module.exports = adminRouter;
