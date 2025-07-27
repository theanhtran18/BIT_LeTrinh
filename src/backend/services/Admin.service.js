/**
 * Admin service
 * @module services/Admin
 * @requires sequelize
 *
 */
const { Admin, Customer, CustomerAdmin } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  checkAdmin,
  getAppIdFromToken,
} = require("../utils/jwt");
const sequelize = require("../models").sequelize;

/**
 * Create a new admin
 * @param {Object} admin - The admin object
 * @returns {Promise<Object>} The newly created admin
 */
exports.createAdmin = async (admin) => {
  console.log(admin);
  if (!admin.customer_id || !admin.app_id) {
    throw new Error("Customer id and app id are required");
  }

  const transaction = await sequelize.transaction();
  try {
    const customer = await Customer.findOne(
      {
        where: { id: admin.customer_id },
      },
      { transaction }
    );
    if (!customer) {
      throw new Error("Customer not found");
    }

    const createAdmin = await Admin.create(admin, { transaction });

    await CustomerAdmin.create(
      {
        admin_id: createAdmin.id,
        customer_id: admin.customer_id,
      },
      { transaction }
    );
    await transaction.commit();

    return createAdmin;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error);
  }
};

/**
 * Get all admins
 * @returns {Promise<Array<Object>>} All admins
 */
exports.getAdmins = async () => {
  return await Admin.findAll({
    attributes: { exclude: ["token", "id"] },
    include: [
      {
        model: Customer,
        as: "customers",
        through: {
          attributes: {
            exclude: ["createdAt", "updatedAt", "admin_id", "customer_id"],
          },
        },
      },
    ],
  });
};

/**
 * check user is admin or not
 * @param {string} customer_id - The customer id
 * @param {string} app_id - The app id
 * @returns {Promise<Object>} The admin object
 */

exports.checkAdmin = async (customer_id, app_id) => {
  const isAdmin = await Admin.findOne({
    where: { customer_id, app_id },
  });
  let token;
  let refresh_token;
  if (isAdmin) {
    token = generateAccessToken(customer_id, app_id, true);
    refresh_token = generateRefreshToken(customer_id, app_id, true);
    await Customer.update({ refresh_token }, { where: { id: customer_id } });
    return {
      isAdmin: true,
      token,
      refresh_token,
    };
  } else {
    token = generateAccessToken(customer_id, app_id, false);
    refresh_token = generateRefreshToken(customer_id, app_id, false);
    return {
      isAdmin: false,
      token,
      refresh_token,
    };
  }
};

/**
 *
 * @param {String} refresh_token the refresh token to be refreshed
 * @returns {String} The new access token
 */

exports.refreshToken = async (refresh_token) => {
  const user = await Customer.findOne({
    where: { refresh_token },
  });
  if (!user) {
    throw new Error("Invalid refresh token");
  }
  const isAdmin = checkAdmin(refresh_token);
  const app_id = getAppIdFromToken(refresh_token);
  const new_token = generateAccessToken(user.id, app_id, isAdmin);
  return new_token;
};
