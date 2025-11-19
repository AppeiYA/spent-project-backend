const express = require("express");
const authMiddleware = require("../middleware/authMiddleWare");
const upload = require("../middleware/multer");
const uploadAvatar = require("../controllers/user.controller");
const userRouter = express.Router();

// request: /api/users/upload-avatar
userRouter.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

module.exports = userRouter;
