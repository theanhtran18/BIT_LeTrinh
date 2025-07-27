const categoryService = require("../services/Category.service");

/**
 * Get all categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a category by id
 */
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json(category)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


/**
 * Update a category
 * @param {Request} req
 * @param {Response} res
 *  @return {Promise<Response>}
 */

exports.updateCategory = async (req, res) => {
  const {id} = req.params;
  const category = await categoryService.updateCategory(id, req.body);
  return res.status(200).json(category);
}

/**
 * Delete category
 * @param {Request}
 * @param {Response}
 * @returns {Promise<Respone>}
 */
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.status(204).end();
};


