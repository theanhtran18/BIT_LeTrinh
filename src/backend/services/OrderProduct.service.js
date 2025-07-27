/**
 * CRUD operations for OrderProducts
 */
const { OrderProduct, Product } = require("../models");

/**
 * Create an order product
 * @param {object} orderProduct - The order product object
 * @param {Object} options - The transaction options
 * @returns {Promise<OrderProduct>} A promise that contains the order product
 */
exports.createOrderProduct = async (orderProduct, options = {}) => {
  return await OrderProduct.create(orderProduct, options);
};

/**
 * Get all order products
 * @returns {Promise<OrderProduct[]>} A promise that contains the order products
 */
exports.getAllOrderProducts = async () => {
  return await OrderProduct.findAll({
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  });
};

/**
 * Get an order product by id
 * @param {string} id - The order product id
 * @returns {Promise<OrderProduct>} A promise that contains the order product
 */
exports.getOrderProductById = async (id) => {
  return await OrderProduct.findByPk(id, {
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  });
};

/**
 * Update an order product
 * @param {string} id - The order product id
 * @param {object} orderProduct - The order product object
 * @returns {Promise<OrderProduct>} A promise that contains the order product
 */
exports.updateOrderProduct = async (id, orderProduct) => {
  const updatedOrderProduct = await OrderProduct.update(orderProduct, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedOrderProduct[1][0];
};

/**
 * Delete an order product
 * @param {string} id - The order product id
 * @returns {Promise<OrderProduct>} A promise that contains the order product
 */
exports.deleteOrderProduct = async (id) => {
  const destroyedOrderProduct = await OrderProduct.destroy({
    where: {
      id,
    },
  });
  return destroyedOrderProduct;
};
/**
 * Delete an order product by order id
 * @param {string} id - The order id
 * @param {Object} options - The transaction options
 * @returns {Promise<OrderProduct>} A promise that contains the order product
 */
exports.deleteOrderProductsByOrderId = async (id, options = {}) => {
  console.log("deleteOrderProductsByOrderId", id);

  const destroyedOrderProduct = await OrderProduct.destroy(
    {
      where: {
        order_id: id,
      },
    },
    options
  );
  console.log("destroyedOrderProduct", destroyedOrderProduct);

  return destroyedOrderProduct;
};

/**
 * Get all order products by order id
 * @param {string} id - The order id
 * @returns {Promise<OrderProduct[]>} A promise that contains the order products
 */
exports.getOrderProductsByOrderId = async (id) => {
  return await OrderProduct.findAll({
    where: {
      order_id: id,
    },
    include: [
      {
        model: Product,
        as: "product",

        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
    attributes: {
      exclude: ["id", "createdAt", "updatedAt"],
    },
  });
};

/**
 * Get all order products by product id
 * @param {string} id - The product id
 * @returns {Promise<OrderProduct[]>} A promise that contains the order products
 */
exports.getOrderProductsByProductId = async (id) => {
  return await OrderProduct.findAll({
    where: {
      product_id: id,
    },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  });
};

/**
 * Get all order products by order id and product id
 * @param {string} orderId - The order id
 * @param {string} productId - The product id
 * @returns {Promise<OrderProduct[]>} A promise that contains the order products
 */
exports.getOrderProductsByOrderIdAndProductId = async (orderId, productId) => {
  return await OrderProduct.findAll({
    where: {
      order_id: orderId,
      product_id: productId,
    },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
};
