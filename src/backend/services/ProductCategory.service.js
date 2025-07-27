/**
 * CRUD operations for ProductCategory
 */

const { ProductCategory } = require("../models");

/**
 * Create a productCategory
 * @param {object} productCategory - The productCategory object
 * @param {Object} options - The transaction options
 * @returns {Promise<ProductCategory>} A promise that contains the productCategory
 *
 */

exports.createProductCategory = async (productCategory, options = {}) => {
  return await ProductCategory.create(productCategory, options);
};

/**
 * Update a productCategory
 * @param {string} CategoryId - The id of the Category
 * @param {string} ProductId - The id of the Product
 * @returns {Promise<ProductCategory>} A promise that contains the productCategory
 *
 */
exports.updateProductCategory = async (CategoryId, ProductId) => {
  const [affectedRows] = await ProductCategory.update(ProductId, {
    where: {
      CategoryId,
      ProductId,
    },
  });
  return affectedRows;
};

/**
 * Delete a productCategory
 * @param {string} id - The id of the productCategory
 * @returns {Promise<ProductCategory>} A promise that contains the productCategory
 *
 */
exports.deleteProductCategory = async (id) => {
  return await ProductCategory.destroy({
    where: {
      id,
    },
  });
};

/**
 * Get all productCategories
 * @returns {Promise<ProductCategory[]>} A promise that contains the productCategories
 *
 */
exports.getAllProductCategories = async () => {
  return await ProductCategory.findAll();
};
