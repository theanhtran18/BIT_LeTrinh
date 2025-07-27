/**
 * CRUD operations for Variant
 *
 */

const { VariantOption } = require("../models");

/**
 * Get all variantOptions
 * @returns {Promise<VariantOption[]>} A promise that contains the variantOptions
 *
 */
exports.getAllVariantOptions = async () => {
  return await VariantOption.findAll();
};

/**
 * Get a variantOption by id
 * @param {string} id - The id of the variantOption
 * @returns {Promise<VariantOption>} A promise that contains the variantOption
 *
 */
exports.getVariantOptionById = async (id) => {
  return await VariantOption.findByPk(id);
};
exports.getVariantOptionByIds = async (ids) => {
  return await VariantOption.findAll({
    where: {
      id: ids,
    },
  });
};

/**
 * Create a variantOption
 * @param {object} variantOption - The variantOption object
 * @returns {Promise<VariantOption>} A promise that contains the variantOption
 *
 */
exports.createVariantOption = async (variantOption) => {
  return await VariantOption.create(variantOption);
};

/**
 * Update a variantOption
 * @param {string} id - The id of the variantOption
 * @param {object} variantOption - The variantOption object
 * @returns {Promise<VariantOption>} A promise that contains the variantOption
 *
 */
exports.updateVariantOption = async (id, variantOption) => {
  const updatedVariantOption = await VariantOption.update(variantOption, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedVariantOption[1][0];
};

/**
 * Delete a variantOption
 * @param {string} id - The id of the variantOption
 * @returns {Promise<VariantOption>} A promise that contains the variantOption
 *
 */
exports.deleteVariantOption = async (id) => {
  return await VariantOption.destroy({
    where: {
      id,
    },
  });
};

// /**
//  * Add a variantOption to a variant
//  * @param {string} variantId - The id of the variant,
//  * @param {string} variantOptionId - The id of the variantOption
//  * @returns {Promise<VariantOption>} A promise that contains the variantOption
//  *
//  */

// exports.addOptionToVariant = async (variantId, variantOptionId) => {
//   const result = await VariantOption.findByPk(variantOptionId);
//   if (!result) {
//     throw new Error("VariantOption not found");
//   }
//   result.variantId = variantId;
//   return await result.save();
// };
