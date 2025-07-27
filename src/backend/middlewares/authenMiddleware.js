// authMiddleware.js
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      if (!token || token.type === "refresh") {
        return res.status(401).json({ message: "Not authorized, no token" });
      }
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(499)
              .json({ message: "Not authorized, token is expired" });
          }

          return res
            .status(401)
            .json({ message: "Not authorized, token failed" });
        }
        if (user.type === "refresh") {
          return res
            .status(401)
            .json({ message: "Not authorized, token is not valid !" });
        }
        req.user = user;

        return user.isAdmin || user.systemAdmin
          ? next()
          : res
              .status(401)
              .json({ message: "Not authorized, user is not an admin" });
      });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, token failed or expired" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

exports.systemAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res
              .status(499)
              .json({ message: "Not authorized, token is expired" });
          }

          return res
            .status(401)
            .json({ message: "Not authorized, token failed" });
        }
        if (user.type === "refresh") {
          return res
            .status(401)
            .json({ message: "Not authorized, token is not valid !" });
        }
        req.user = user;
        return user.systemAdmin
          ? next()
          : res
              .status(401)
              .json({ message: "Not authorized, Only allow System Admin" });
      });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized, token failed or expired" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
