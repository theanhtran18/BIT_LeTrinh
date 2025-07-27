/**
 * Product Controller
 * @module ProductController
 */
const sequelize = require("../models").sequelize;
const productService = require("../services/Product.service");
const categoryService = require("../services/Category.service");
const variantService = require("../services/Variant.service");
const ProductCategoryService = require("../services/ProductCategory.service");
const ProductVariantService = require("../services/ProductVariant.service");
/**
 * Get all products
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.getAllProducts = async (req, res) => {  
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a product by id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Please provide product id" });
  }
  try {
    const product = await productService.getProductById(id);
    return product
      ? res.status(200).json(product)
      : res.status(404).json({ error: `Product ${id} not found` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a product
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.createProduct = async (req, res) => {
  const item = req.body;

  const transaction = await sequelize.transaction();
  try {
    const product = await productService.createProduct(
      {
        name: item?.name,
        price: item?.price,
        image: req.file?.path,
        description: item?.description,
      },
      { transaction }
    );
    if (item.categoryId) {
      console.log("item.categoryId", item.categoryId);

      for (const categoryId of item.categoryId) {
        const category = await categoryService.getCategoryById(categoryId);
        if (!category) {
          await transaction.rollback();
          return res.status(404).json({
            error: `Category ${categoryId} not found, Can't create product`,
          });
        }

        await ProductCategoryService.createProductCategory(
          {
            product_id: product.id,
            category_id: category.id,
          },
          { transaction }
        );
      }
    }

    if (item.variantId) {
      console.log("item.variantId", item.variantId);

      for (const variantId of item?.variantId) {
        const variant = await variantService.getVariantById(variantId);
        if (!variant) {
          await transaction.rollback();
          return res.status(404).json({
            error: `Variant ${variantId} not found, Can't create product`,
          });
        }

        await ProductVariantService.createProductVariant(
          {
            product_id: product.id,
            variant_id: variant.id,
          },
          { transaction }
        );
      }
      for (const variantId of item?.variantId) {
        const variant = await variantService.getVariantById(variantId);
        if (!variant) {
          await transaction.rollback();
          return res.status(404).json({
            error: `Variant ${variantId} not found, Can't create product`,
          });
        }

        await ProductVariantService.createProductVariant(
          {
            product_id: product.id,
            variant_id: variant.id,
          },
          { transaction }
        );
      }
      for (const variantId of item?.variantId) {
        const variant = await variantService.getVariantById(variantId);
        if (!variant) {
          await transaction.rollback();
          return res.status(404).json({
            error: `Variant ${variantId} not found, Can't create product`,
          });
        }

        await ProductVariantService.createProductVariant(
          {
            product_id: product.id,
            variant_id: variant.id,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Product created successfully",
      result: {
        id: product.id,
        name: product.name,
        image: product.image,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ error: "Product already exists, Can't create product" });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(404)
        .json({ error: "Category or Variant not found, Can't create product" });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

/**
 * Update a product
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;

  if (!id) {
    return res.status(400).json({ error: "Please provide product id" });
  }

  if (!product || Object.keys(product).length === 0) {
    return res.status(400).json({ error: "Please provide details to update" });
  }

  const transaction = await sequelize.transaction();
  let updateResult = "";

  try {
    if (req.file) {
      product.image = req.file?.path;
    }

    const productUpdateResult = await productService.updateProduct(
      id,
      product,
      { transaction }
    );
    updateResult += productUpdateResult
      ? "Update product's information has been success\n"
      : "";

    if (product.categoryId && product.categoryId.length > 0) {
      const categoryUpdateResult = await productService.updateProductCategories(
        id,
        product.categoryId,
        { transaction }
      );
      updateResult += categoryUpdateResult
        ? "Update categories has been success\n"
        : "";
    }

    if (product.variantId && product.variantId.length > 0) {
      const variantUpdateResult = await productService.updateProductVariants(
        id,
        product.variantId,
        { transaction }
      );
      updateResult += variantUpdateResult
        ? "Update variants has been success\n"
        : "";
    }

    await transaction.commit();

    return updateResult !== ""
      ? res.status(200).json({ message: updateResult })
      : res.status(400).json({
          error:
            "Update failed, Can't found product or can't match field name, please check it!",
        });
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction rolled back due to:", error);
    if (error.code === "ER_LOCK_WAIT_TIMEOUT") {
      return res
        .status(500)
        .json({ error: "Database timeout, please try again." });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a product
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await productService.deleteProduct(id).then((result) => {
      return result
        ? res.status(200).json({ message: `Product ${id} has been deleted` })
        : res
            .status(404)
            .json({ error: `Product ${id} not found, Can't delete product` });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all products by category Id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.getProductsByCategoryId = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productService.getProductsByCategoryId(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all products by category name
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 *
 */
exports.getProductsByCategoryName = async (req, res) => {
  const { name } = req.params;
  try {
    const products = await productService.getProductsByCategoryName(name);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all categories of a product id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.getCategoriesByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await productService.getCategoriesByProductId(id);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get products by order id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getProductsByOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productService.getProductsByOrderId(id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get order by product id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getOrderByProductId = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await productService.getOrdersByProductId(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload image
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.updateImage = async (req, res) => {
  console.log(req);

  const id = req.params.id;
  try {
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: `Product ${id} not found` });
    }
    if (req.file) {
      const result = await productService.updateProduct(id, {
        image: req.file.path,
      });

      return result
        ? res.status(200).json({ message: "Image uploaded successfully" })
        : res.status(500).json({ error: "Image upload failed" });
    } else {
      return res.status(400).json({ error: "Please provide an image" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
