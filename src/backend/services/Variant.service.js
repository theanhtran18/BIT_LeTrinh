/**
 * CRUD operations for Variant
 *
 */

const { includes } = require("lodash");
const { Variant, VariantOption } = require("../models");

/**
 * Get all variants
 * @returns {Promise<Variant[]>} A promise that contains the variants
 *
 */
exports.getAllVariants = async () => {
  return await Variant.findAll({
    include: [
      {
        model: VariantOption,
        as: "options",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

/**
 * Get a variant by id
 * @param {string} id - The id of the variant
 * @returns {Promise<Variant>} A promise that contains the variant
 *
 */
exports.getVariantById = async (id) => {
  return await Variant.findByPk(id);
};

/**
 * Get a variant by name
 * @param {string} name - The name of the variant
 * @returns {Promise<Variant>} A promise that contains the variant
 *
 */
exports.getVariantByName = async (name) => {
  return await Variant.findOne({
    where: {
      name: name,
    },
  });
};

/**
 * Create a variant
 * @param {object} variant - The variant object
 * @returns {Promise<Variant>} A promise that contains the variant
 *
 */
exports.createVariant = async (variant) => {
  return await Variant.create(variant);
};

/**
 * Update a variant
 * @param {string} id - The id of the variant
 * @param {object} variant - The variant object
 * @returns {Promise<Variant>} A promise that contains the variant
 *
 */
exports.updateVariant = async (id, variant) => {
  const updatedVariant = await Variant.update(variant, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedVariant[1][0];
};

/**
 * Delete a variant
 * @param {string} id - The id of the variant
 * @returns {Promise<Variant>} A promise that contains the variant
 *
 */
exports.deleteVariant = async (id) => {
  return await Variant.destroy({
    where: {
      id,
    },
  });
};
