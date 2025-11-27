const jwt = require("jsonwebtoken");
const StatusCodes = require("../utils/StatusCodes");

const authAdminMiddleware = async (req, res, next) => {
  const Header = req.headers["authorization"];

  if (!Header || !Header.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "No token provided",
    });
  }

  const token = Header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //{user_id:..., email:...}

    // check if user is admin
    if(decoded.role != 'admin'){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "User unauthorized"
        })
    }
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid or Expired token",
    });
  }

};

module.exports = authAdminMiddleware;
