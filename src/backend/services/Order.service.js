/**
 * @typedef {import('../models/Order.model').Order} Order
 * @typedef {import('../models/Order.model').OrderProduct} OrderProduct
 * CRUD operations for Orders
 *
 */

/**
 * Create an order
 * @param {Order} order - The order object
 * @param {Object} options - The transaction options
 * @returns {Promise<Order>} A promise that contains the order
 *
 */
const { where } = require("sequelize");
const {
  Order,
  OrderProduct,
  Product,
  Customer,
  Discount,
  Payment,
} = require("../models");

exports.createOrder = async (order, options = {}) => {
  return await Order.create(order, options);
};

/**
 * Get all orders
 * @returns {Promise<Order[]>} A promise that contains the orders
 */
exports.getAllOrders = async () => {
  const orders = await Order.findAll({
    attributes: {
      exclude: [
        "order_id",
        "customer_id",
        "product_id",
        "createdAt",
        "updatedAt",
      ],
    },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Discount,
        as: "discounts",
        through: {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      },
      {
        model: Product,
        as: "products",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: ["quantity", "options"],
          as: "OrderProduct",
        },
      },
      {
        model: Payment,
        as: "payment",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
  const responseFormat = orders.map((order) => {
    const orderData = order.toJSON();

    const details = orderData.products.map((product) => {
      const productData = product;

      productData.quantity = product.OrderProduct.quantity;
      productData.options = product.OrderProduct.options;
      delete productData.OrderProduct;
      return productData;
    });
    orderData.details = details;
    delete orderData.products;

    // sort the orders by the craetedAt date
    orderData.details = orderData.details.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return orderData;
  });
  return responseFormat.reverse();
};

/**
 * Get all orders by payment status, field payment_status get from Payment Model
 * @param {string} paymentStatus the payment status of the order, this can be either 'SUCCESS', 'PENDING', 'FAILED'
 * @returns Promise<Order[]> A promise that contains the orders
 */

exports.getOrdersByPaymentStatus = async (paymentStatus) => {
  console.log("paymentStatus", paymentStatus);

  const orders = await Order.findAll({
    attributes: {
      exclude: [
        "order_id",
        "customer_id",
        "product_id",
        "createdAt",
        "updatedAt",
      ],
    },
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: Discount,
        as: "discounts",
        attributes: { exclude: ["createdAt", "updatedAt"] },
        through: {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      },
      {
        model: Product,
        as: "products",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: ["quantity", "options"],
          as: "OrderProduct",
        },
      },
      {
        model: Payment,
        as: "payment",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
    where: {
      "$payment.status$": paymentStatus,
      "$payment.payment_method$": [
        "COD",
        "COD_SANDBOX",
        "BANK",
        "BANK_SANDBOX",
      ],
    },
  });
  const responseFormat = orders.map((order) => {
    const orderData = order.toJSON();

    const details = orderData.products.map((product) => {
      const productData = product;

      productData.quantity = product.OrderProduct.quantity;
      productData.options = product.OrderProduct.options;
      delete productData.OrderProduct;
      return productData;
    });
    orderData.details = details;
    delete orderData.products;

    return orderData;
  });
  return responseFormat.reverse();
};

/**
 * Get an order by id
 * @param {string} id - The order id
 * @param {Object} options - The transaction options
 * @returns {Promise<Order>} A promise that contains the order
 */
exports.getOrderById = async (id, options = {}) => {
  const orders = await Order.findByPk(
    id,
    {
      attributes: {
        exclude: [
          "order_id",
          "customer_id",
          "product_id",
          "createdAt",
          "updatedAt",
        ],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: { exclude: ["createdAt", "updatedAt", "refresh_token"] },
        },
        {
          model: Discount,
          as: "discounts",
          through: {
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
        {
          model: Product,
          as: "products",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          through: {
            attributes: ["quantity", "options"],
            as: "OrderProduct",
          },
        },
        {
          model: Payment,
          as: "payment",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    },
    options
  );
  const orderData = orders.toJSON();

  const details = orderData.products.map((product) => {
    const productData = product;

    productData.quantity = product.OrderProduct.quantity;
    productData.options = product.OrderProduct.options;
    delete productData.OrderProduct;
    return productData;
  });
  orderData.details = details;
  delete orderData.products;

  return orderData;
};

/**
 * Update an order
 * @param {Order} order - The order object
 * @param {Object} options - The transaction options
 * @returns {Promise<Order>} A promise that contains the order
 */
exports.updateOrder = async (order, options = {}) => {
  return await order.save(options);
};

/**
 * Update the payment status of an order
 * @param {Order} order the order object
 * @param {Enumerator} status the status of the payment, this can be either 'SUCCESS', 'PENDING', 'FAILED'
 * @param {Object} options the transaction options
 */

exports.updateOrderPaymentStatus = async (order_id, status, options = {}) => {
  const update = await Payment.update(
    { status, createdAt: new Date() },
    { where: { order_id } },
    options
  );
  return update[0] > 0;
};

/**
 * Delete an order
 * @param {String} id - The order id
 * @param {Object} options - The transaction options
 * @returns {Promise<Order>} A promise that contains the order
 */
exports.deleteOrder = async (id, options = {}) => {
  return await Order.destroy({ where: { id } }, options);
};
