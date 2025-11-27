const express = require("express");
const authMiddleware = require("../middleware/authMiddleWare");
const upload = require("../middleware/multer");
const {
  uploadAvatar,
  getProfile,
  updateProfile,
} = require("../controllers/user.controller");
const userRouter = express.Router();

// request: /api/users/upload-avatar
userRouter.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

userRouter.get("/me", authMiddleware, getProfile);

userRouter.put("/me", authMiddleware, updateProfile);

module.exports = userRouter;
