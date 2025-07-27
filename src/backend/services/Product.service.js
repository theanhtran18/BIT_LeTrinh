/**CRUD operations for Product
 * @module services/Product.service
 *
 *
 */
const { where } = require("sequelize");
const {
  Product,
  Variant,
  Category,
  OrderProduct,
  Order,
  ProductVariant,
  VariantOption,
} = require("../models");

/**
 * Get all products *
 * @returns {Promise<Product[]>} A promise that contains the products
 */

exports.getAllProducts = async () => {
  // Update,only get the active product
  const products = await Product.findAll({
    where: {
      active: true,
    },

    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Variant,
        as: "variants",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: VariantOption,
            as: "options",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        through: {
          attributes: [],
        },
      },
      {
        model: Category,
        as: "categories",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: [],
        },
      },
    ],
  });

  const productsResponse = products.map((product) => {
    const productResponse = product.toJSON();
    productResponse.categoryId = product.categories.map(
      (category) => category.id
    );
    productResponse.variantId = product.variants.map((variant) => variant.id);
    delete productResponse.categories;
    delete productResponse.variants;
    return productResponse;
  });

  return productsResponse;
};

/**
 * Get a product by id *
 * @param {string} id - The id of the product
 * @returns {Promise<Product>} A promise that contains the product
 */
exports.getProductById = async (id) => {
  const product = await Product.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Variant,
        as: "variants",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: VariantOption,
            as: "options",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        through: {
          attributes: [],
        },
      },
      {
        model: Category,
        as: "categories",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: [],
        },
      },
    ],
  });

  const productResponse = product?.toJSON();
  productResponse.categoryId = product.categories.map(
    (category) => category.id
  );
  productResponse.variantId = product.variants.map((variant) => variant.id);
  delete productResponse.categories;
  delete productResponse.variants;
  return productResponse;
};

/**
 * Get a product by name
 * @param {string} name - The name of the product
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<Product>} A promise that contains the product
 *
 */
exports.getProductByName = async (name, options = {}) => {
  const product = await Product.findOne(
    {
      where: {
        name: name,
        active: true,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Variant,
          as: "variants",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: VariantOption,
              as: "options",
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
          through: {
            attributes: [],
          },
        },
        {
          model: Category,
          as: "categories",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          through: {
            attributes: [],
          },
        },
      ],
    },
    options
  );

  const productResponse = product.toJSON();
  productResponse.categoryId = product.categories.map(
    (category) => category.id
  );
  productResponse.variantId = product.variants.map((variant) => variant.id);
  delete productResponse.categories;
  delete productResponse.variants;
  return productResponse;
};

/**
 * Create a product
 *
 * @param {Object} product - The product object
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<Product>} A promise that contains the product
 */
exports.createProduct = async (product, options = {}) => {
  return await Product.create(product, options);
};

/**
 * Update a product
 *
 * @param {string} id - The id of the product
 * @param {Object} product - The product object
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<boolean>} A promise that contains the product
 */
exports.updateProduct = async (id, product, options = {}) => {
  const [affectedRows] = await Product.update(
    product,
    {
      where: {
        id,
      },
    },
    options
  );
  return affectedRows > 0;
};

/**
 * Update categories of a product
 * @param {string} productId - The id of the product
 * @param {string[]} categoryIds - The ids of the categories
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<boolean>} A promise that contains the result
 */
exports.updateProductCategories = async (
  productId,
  categoryIds,
  options = {}
) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  const currentCategories = await product.getCategories();
  const currentCategoryIds = currentCategories.map((category) => category.id);
  const categoriesToAdd = categoryIds.filter(
    (categoryId) => !currentCategoryIds.includes(categoryId)
  );
  const categoriesToRemove = currentCategoryIds.filter(
    (categoryId) => !categoryIds.includes(categoryId)
  );
  try {
    if (categoriesToAdd.length === 0 && categoriesToRemove.length === 0) {
      return false;
    }
    if (categoriesToAdd.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: categoriesToAdd,
        },
      });
      await product.addCategories(categories, options);
    }
    if (categoriesToRemove.length > 0) {
      const categories = await Category.findAll({
        where: {
          id: categoriesToRemove,
        },
      });
      await product.removeCategories(categories, options);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Update variants of a product
 * @param {string} productId - The id of the product
 * @param {string[]} variantIds - The ids of the variants
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<boolean>} A promise that contains the result
 */
exports.updateProductVariants = async (productId, variantIds, options = {}) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  const currentVariants = await product.getVariants();
  const currentVariantIds = currentVariants.map((variant) => variant.id);
  const variantsToAdd = variantIds.filter(
    (variantId) => !currentVariantIds.includes(variantId)
  );
  const variantsToRemove = currentVariantIds.filter(
    (variantId) => !variantIds.includes(variantId)
  );
  try {
    if (variantsToAdd.length === 0 && variantsToRemove.length === 0) {
      return false;
    }
    if (variantsToAdd.length > 0) {
      const variants = await Variant.findAll({
        where: {
          id: variantsToAdd,
        },
      });
      await product.addVariants(variants, options);
    }
    if (variantsToRemove.length > 0) {
      const variants = await Variant.findAll({
        where: {
          id: variantsToRemove,
        },
      });
      await product.removeVariants(variants, options);
    }
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a product
 *
 * @param {string} id - The id of the product
 * @param {Object} options - The options object, which can include the transaction
 * @returns {Promise<int>} A promise that contains the result 1 if deleted, 0 if not
 *
 */
exports.deleteProduct = async (id) => {
  const result = await Product.update(
    { active: false },
    {
      where: {
        id,
      },
    }
  );
  return result;
};

/**
 * Get all variants of a product
 *
 * @param {string} productId - The id of the product
 * @returns {Promise<Variant[]>} A promise that contains the variants
 */
exports.getVariantsByProductId = async (productId) => {
  return await Variant.findAll({
    where: {
      product_id: productId,
    },
  });
};

/**
 * Get all categories of a product
 *
 * @param {string} productId - The id of the product
 * @returns {Promise<Category[]>} A promise that contains the categories
 */
exports.getCategoriesByProductId = async (productId) => {
  return await Category.findAll({
    include: [
      {
        model: Product,
        as: "products",
        where: {
          id: productId,
        },
      },
    ],
  });
};

/**
 * Get all products of a category
 *
 * @param {string} categoryId - The id of the category
 * @returns {Promise<Product[]>} A promise that contains the products
 */
exports.getProductsByCategoryId = async (categoryId) => {
  const products = await Product.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Variant,
        as: "variants",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: VariantOption,
            as: "options",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        through: {
          attributes: [],
        },
      },
      {
        model: Category,
        as: "categories",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: [],
        },
        where: {
          id: categoryId,
        },
      },
    ],
  });

  const productsResponse = products.map((product) => {
    const productResponse = product.toJSON();
    productResponse.categoryId = product.categories.map(
      (category) => category.id
    );
    productResponse.variantId = product.variants.map((variant) => variant.id);
    delete productResponse.categories;
    delete productResponse.variants;
    return productResponse;
  });

  return productsResponse;
};
/**
 * Get all products of a category
 *
 * @param {string} categoryName - The name of the category
 * @returns {Promise<Product[]>} A promise that contains the products
 */
exports.getProductsByCategoryName = async (categoryName) => {
  const products = await Product.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: Variant,
        as: "variants",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: VariantOption,
            as: "options",
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        through: {
          attributes: [],
        },
      },
      {
        model: Category,
        as: "categories",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: [],
        },
        where: {
          name: categoryName,
        },
      },
    ],
  });

  const productsResponse = products.map((product) => {
    const productResponse = product.toJSON();
    productResponse.categoryId = product.categories.map(
      (category) => category.id
    );
    productResponse.variantId = product.variants.map((variant) => variant.id);
    delete productResponse.categories;
    delete productResponse.variants;
    return productResponse;
  });

  return productsResponse;
};

/**
 * Get all products of an order
 *
 * @param {string} orderId - The id of the order
 * @returns {Promise<Product[]>} A promise that contains the products
 */
exports.getProductsByOrderId = async (orderId) => {
  return await Product.findAll({
    include: [
      {
        model: OrderProduct,
        as: "order_products",
        where: {
          order_id: orderId,
        },
      },
    ],
  });
};

/**
 * Get all orders of a product
 *
 * @param {string} productId - The id of the product
 * @returns {Promise<Order[]>} A promise that contains the orders
 */

exports.getOrdersByProductId = async (productId) => {
  return await Order.findAll({
    include: [
      {
        model: OrderProduct,
        as: "order_products",
        where: {
          product_id: productId,
        },
      },
    ],
  });
};

/**
 * Add a variant to a product
 *
 * @param {string} productId - The id of the product
 * @param {Object} variantId - The variant object
 * @returns {Promise<Variant>} A promise that contains the variant
 */
exports.addVariantToProduct = async (productId, variantId) => {
  const product = await Product.findByPk(productId);
  const variant = await Variant.findByPk(variantId);
  if (!variant) {
    throw new Error("Variant not found");
  }
  if (!product) {
    throw new Error("Product not found");
  }
  return await ProductVariant.create({
    product_id: productId,
    variant_id: variantId,
  });
};
