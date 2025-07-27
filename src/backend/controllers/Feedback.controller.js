/**
 * Product Controller
 * @module Feedback.Controller
 */
const sequelize = require("../models").sequelize;
const feedbackService = require("../services/Feedback.service")


/**
 * Get all feedbacks
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        res.status(200).json({
            message: "Get feedbacks successfully.",
            data: feedbacks
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error : error.message });
    }
}

/**
 * Get feedback by Id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
exports.getFeedback = async (req, res) => {
    const { id } = req.params;
    // Check if ID is provided in the request
    if (!id) {
        return res.status(400).json({
            message: "Please provide feedback id."
        });
    }
    try {
        const feedback = await feedbackService.getFeedback(id);
        return feedback 
        ? res.status(200).json(feedback)
        : res.status(404).json({ error : `Feedback ${id} not found.`})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get a customer by id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} A promise that contains the response
 *
 */
  
  exports.getFeedbacksByUserId = async (req, res) => {
    const { id } = req.params;
    const orders = await feedbackService.getFeedbacksByUserId(id);
    return res.status(200).json(orders);
  };


/**
 * Create a feedback
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */

exports.createFeedback = async (req, res) => {
    const item = req.body;

    if (!item.service_type || !item.rating || !item.comment || !item.customer_id) {
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    try {
        const feedback = await feedbackService.createFeedback({
            service_type: item.service_type,
            rating: item.rating,
            comment: item.comment,
            customer_id: item.customer_id
        });
        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}