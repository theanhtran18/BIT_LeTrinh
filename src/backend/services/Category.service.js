/**
 * CRUD operations for Category
 * @module services/Category.service
 *
 */
const { Category } = require("../models");

/**
 * Get all categories
 * @returns {Promise<Category[]>} A promise that contains the categories
 *
 */
exports.getAllCategories = async () => {
  return await Category.findAll();
};

/**
 * Get a category by id
 * @param {string} id - The id of the category
 * @returns {Promise<Category>} A promise that contains the category
 *
 */
exports.getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

/**
 * Get a category by name
 * @param {string} name - The name of the category
 * @returns {Promise<Category>} A promise that contains the category
 *
 */
exports.getCategoryByName = async (name) => {
  return await Category.findOne({
    where: {
      name,
    },
  });
};

/**
 * Create a category
 * @param {object} category - The category object
 * @returns {Promise<Category>} A promise that contains the category
 *
 */
exports.createCategory = async (category) => {
  return await Category.create(category);
};

/**
 * Update a category
 * @param {string} id - The id of the category
 * @param {object} category - The category object
 * @returns {Promise<Category>} A promise that contains the category
 *
 */
exports.updateCategory = async (id, category) => {
  const updatedCategory = await Category.update(category, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedCategory[1][0];
};

/**
 * Delete a category
 * @param {string} id - The id of the category
 * @returns {Promise<Category>} A promise that contains the category
 *
 */
exports.deleteCategory = async (id) => {
  return await Category.destroy({
    where: {
      id,
    },
  });
};
