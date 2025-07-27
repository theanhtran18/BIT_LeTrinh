/**
 * CRUD operations for Customer
 * @module services/Customer.service
 */

const {
  Customer,
  Order,
  Product,
  OrderProduct,
  Discount,
} = require("../models");

/**
 * Get all customers
 * @returns {Promise<Customer[]>} A promise that contains the customers
 *
 */
exports.getAllCustomers = async () => {
  return await Customer.findAll({
    attributes: { exclude: ["createdAt", "updatedAt", "refresh_token"] },
    order: [["createdAt", "DESC"]],
  });
};

/**
 * Get a customer by id
 * @param {string} id - The id of the customer
 * @param {Object} options - The options for the query, e.g., transaction
 * @returns {Promise<Customer>} A promise that contains the customer
 *
 */
exports.getCustomerById = async (id, options = {}) => {
  return await Customer.findByPk(
    id,
    {
      attributes: { exclude: ["createdAt", "updatedAt", "refresh_token"] },
      order: [["createdAt", "DESC"]],
    },
    options
  );
};

/**
 * Create a customer
 * @param {object} customer - The customer object
 * @param {Object} options - The options for the query, e.g., transaction
 * @returns {Promise<Customer>} A promise that contains the customer
 *
 */
exports.createCustomer = async (customer, options = {}) => {
  return await Customer.create(customer, options);
};

/**
 * Update a customer
 * @param {string} id - The id of the customer
 * @param {object} customer - The customer object
 * @returns {Promise<Customer>} A promise that contains the customer
 *
 */
exports.updateCustomer = async (id, customer, options = {}) => {
  const [affectRow] = await Customer.update(
    customer,
    {
      where: {
        id,
      },
    },
    options
  );
  return affectRow;
};

/**
 * Delete a customer
 * @param {string} id - The id of the customer
 * @returns {Promise<Customer>} A promise that contains the customer
 *
 */
exports.deleteCustomer = async (id) => {
  return await Customer.destroy({
    where: {
      id,
    },
  });
};

/**
 * Get all orders by user id
 * @param {string} userId - The user id
 * @returns {Promise<Order[]>} A promise that contains the orders
 */
exports.getOrdersByCustomerId = async (customerId) => {
  const orders = await Order.findAll({
    where: {
      customer_id: customerId,
    },
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

    return orderData;
  });
  return responseFormat.reverse();
};
