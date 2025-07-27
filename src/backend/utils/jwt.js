const jwt = require("jsonwebtoken");

/**
 *
 * @param {String} user_id
 * @param {String} app_id
 * @param {Boolean} isAdmin
 * @returns {String} access token
 */
exports.generateAccessToken = (user_id, app_id, isAdmin) => {
  const systemAdmin = process.env.SYSTEM_ADMIN_ID;
  if (user_id === systemAdmin) {
    return jwt.sign(
      { systemAdmin: true, type: "access" },
      process.env.JWT_SECRET,
      {
        expiresIn: "3600s",
      }
    );
  }
  return jwt.sign(
    { app_id, user_id, isAdmin, type: "access" },
    process.env.JWT_SECRET,
    {
      expiresIn: "3600s",
    }
  );
};
exports.generateRefreshToken = (user_id, app_id, isAdmin) => {
  const systemAdmin = process.env.SYSTEM_ADMIN_ID;
  if (user_id === systemAdmin) {
    return jwt.sign(
      { systemAdmin: true, type: "refresh" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  }
  return jwt.sign(
    { app_id, user_id, isAdmin, type: "refresh" },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

/**
 * Get user id from token
 * @param {String} token
 * @returns {String} user_id
 */
exports.getUserIdFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.user_id;
};

/**
 *
 * @param {String} token
 * @returns {String} app_id
 * @description get the app id from the token
 */
exports.getAppIdFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.app_id;
};

/**
 *
 * @param {String} token
 * @returns {Boolean} isAdmin
 * @description check if the user is an admin
 */
exports.checkAdmin = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.isAdmin || decoded.systemAdmin;
};
