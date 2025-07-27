/**
 * @module services/Payment
 *
 * CRUD operations for Payment
 */

const { Payment } = require("../models");

/**
 * Get all payments
 * @returns {Promise<Payment[]>} A promise that contains the payments
 */

exports.getAllPayments = async () => {
  return await Payment.findAll();
};

/**
 * Get a payment by id
 * @param {string} id - The id of the payment
 * @returns {Promise<Payment>} A promise that contains the payment
 */

exports.getPaymentById = async (id) => {
  return await Payment.findByPk(id);
};

/**
 * Create a payment
 * @param {object} payment - The payment object
 * @param {Object} options - The transaction options
 * @returns {Promise<Payment>} A promise that contains the payment
 */

exports.createPayment = async (payment, options = {}) => {
  return await Payment.create(payment, options);
};

/**
 * Update a payment
 * @param {string} id - The id of the payment
 * @param {object} payment - The payment object
 * @returns {Promise<Payment>} A promise that contains the payment
 */

exports.updatePayment = async (id, payment) => {
  const updatedPayment = await Payment.update(payment, {
    where: {
      id,
    },
    returning: true,
  });
  return updatedPayment[1][0];
};

/**
 * Delete a payment
 * @param {string} id - The id of the payment
 * @returns {Promise<Payment>} A promise that contains the payment
 */

exports.deletePayment = async (id, options = {}) => {
  const destroyedPayment = await Payment.destroy(
    {
      where: {
        id,
      },
    },
    options
  );
  return destroyedPayment;
};

/**
 * Delete a payment by order id
 * @param {string} id - The id of the order
 * @param {Object} options - The transaction options
 * @returns {Promise<Payment>} A promise that contains the payment
 */

exports.deletePaymentByOrderId = async (id, options = {}) => {
  return await Payment.destroy(
    {
      where: {
        order_id: id,
      },
    },
    options
  );
};

/**
 * Get all payments by order id
 * @param {string} orderId - The id of the customer
 * @returns {Promise<Payment[]>} A promise that contains the payments
 */

exports.getPaymentsByOrderId = async (orderId) => {
  return await Payment.findAll({
    where: {
      order_id: orderId,
    },
  });
};
