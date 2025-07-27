/**
 * Controller for Discount
 */

const DiscountService = require("../services/Discount.service");
const sequelize = require("../models").sequelize;

/**
 * Get all discounts
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await DiscountService.getAllDiscounts();
    res.status(200).json(discounts);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a discount by id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getDiscountById = async (req, res) => {
  const { id } = req.params;
  try {
    const discount = await DiscountService.getDiscountById(id);
    return res.status(200).json(discount);
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get a discount by code
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getDiscountByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const discount = await DiscountService.getDiscountByCode(code);
    return res.status(200).json(discount);
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a discount
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.createDiscount = async (req, res) => {
  const discount = req.body;
  const transaction = await sequelize.transaction();
  try {
    const newDiscount = await DiscountService.createDiscount(discount, {
      transaction,
    });
    await transaction.commit();
    return res.status(201).json(newDiscount);
  } catch (error) {
    console.log("Error", error);
    await transaction.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: error.parent?.sqlMessage });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update a discount
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.updateDiscount = async (req, res) => {
  const { id } = req.params;
  const discount = req.body;
  try {
    const updatedDiscount = await DiscountService.updateDiscount(id, discount);
    console.log("updatedDiscount", updatedDiscount[0]);

    return res
      .status(200)
      .json(
        updatedDiscount[0]
          ? { masssage: "Update successfuly !", data: { id, ...discount } }
          : { masssage: `Update failed, discount id ${id} not found !` }
      );
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a discount
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.deleteDiscount = async (req, res) => {
  const { id } = req.params;
  try {
    await DiscountService.deleteDiscount(id);
    return res.status(200).json({
      message: `Discount ${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {Request} req The request object
 * @param {Response} res the response object
 * @returns {Promise<Response>} The response object
 */

exports.getDiscountConditionsTypes = async (req, res) => {
  try {
    const conditionsTypes = await DiscountService.getDiscountConditionsTypes();

    return res.status(200).json(conditionsTypes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {Request} req The request object
 * @param {Response} res the response object
 * @returns {Promise<Response>} The response object
 */
exports.getOrdersByDiscountId = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await DiscountService.getOrdersByDiscountId(id);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.CheckApplyDiscountToOrder = async (req, res) => {
  const { code, order } = req.body;
  try {
    const check = await DiscountService.CheckApplyDiscountToOrder(code, order);
    return res.status(200).json(check);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDiscountsApplicable = async (req, res) => {
  const order = req.body;

  try {
    const discounts = await DiscountService.getDiscountsApplicableToOrder(order);
    return res.status(200).json(discounts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
