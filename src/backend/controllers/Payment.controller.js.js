/**
 * Controller for Payment
 * @module controllers/Payment.controller
 *
 */

const sequelize = require("../models").sequelize;
const paymentService = require("../services/Payment.service");

/**
 * Get all payments
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
};

/**
 * Get an payments by id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.getPaymentById(id);
    return res.status(200).json(payment);
  } catch (error) {
    console.log("Error", error);

    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a payment
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.createPayment = async (req, res) => {
  const payment = req.body;
  const transaction = await sequelize.transaction();
  try {
    const newPayment = await paymentService.createPayment(payment);
    transaction.commit();
    return res.status(201).json(newPayment);
  } catch (error) {
    console.log("Error", error);
    transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update a payment
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const payment = req.body;
  try {
    const updatedPayment = await paymentService.updatePayment(id, payment);
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete an payment
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await paymentService.deletePayment(id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all payments by order id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getPaymentsByOrderId = async (req, res) => {
  const { id } = req.params;
  try {
    const payments = await paymentService.getPaymentsByOrderId(id);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
