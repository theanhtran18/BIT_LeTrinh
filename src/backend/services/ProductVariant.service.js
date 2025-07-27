/**
 * CRUD operations for ProductVariant
 */
const { ProductVariant } = require("../models");

/**
 * Create a productVariant
 * @param {object} productVariant - The productVariant object
 * @param {Object} options - The transaction options
 * @returns {Promise<ProductVariant>} A promise that contains the productVariant
 *
 */
exports.createProductVariant = async (productVariant, options = {}) => {
  return await ProductVariant.create(productVariant, options);
};

/**
 * Update a productVariant
 * @param {string} id - The id of the productVariant
 * @param {object} productVariant - The productVariant object
 * @returns {Promise<ProductVariant>} A promise that contains the productVariant
 *
 */
exports.updateProductVariant = async (id, productVariant) => {
  const updatedProductVariant = await ProductVariant.update(productVariant, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedProductVariant[1][0];
};

/**
 * Delete a productVariant
 * @param {string} id - The id of the productVariant
 * @returns {Promise<ProductVariant>} A promise that contains the productVariant
 *
 */
exports.deleteProductVariant = async (id) => {
  return await ProductVariant.destroy({
    where: {
      id,
    },
  });
}

/**
 * Get all productVariants
 * @returns {Promise<ProductVariant[]>} A promise that contains the productVariants
 *
 */
exports.getAllProductVariants = async () => {
  return await ProductVariant.findAll();
}

