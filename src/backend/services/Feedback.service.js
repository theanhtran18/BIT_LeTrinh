/**
 * Feedback feature
 * @module services/Feedback.service
 */

const { Feedback, Customer } = require("../models");
const Sequelize = require("sequelize");

/**
 * Get all feedbacks
 * @returns {Promise<Feedback[]>} A promise that contains the feedbacks
 */

exports.getAllFeedbacks = async () => {
    return await Feedback.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "refresh_token"],
          },
        },
      ],
    });
  };


/**
 * Get a feedback by id
 * @param {number} id - The id of the feedback
 * @returns {Promise<Feedback>} A promise that contains the feedback
 */ 
exports.getFeedback = async (id) => {
    return await Feedback.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: {
            exclude: [ "id", "createdAt", "updatedAt", "refresh_token"],
          },
        },
      ],
    });
  };


/**
 * Get feedbacks by user id
 * @param {string} userId - The id of the user
 * @returns {Promise<Feedback[]>} A promise that contains the feedbacks
 */
exports.getFeedbacksByUserId = async (userId) => {
  return await Feedback.findAll({
      where: { customer_id: userId },
      attributes: {
          exclude: ["createdAt", "updatedAt"],
      },
      include: [
          {
              model: Customer,
              as: "customer",
              attributes: {
                  exclude: ["id", "createdAt", "updatedAt", "refresh_token"],
              },
          },
      ],
  });
};

/**
 * Create a feedback
 * @param {Object} feedback - The feedback object
 * @param {Object} options - The transaction options
 * @returns {Promise<Feedback>} A promise that contains the created feedback
 */
exports.createFeedback = async (feedback, options = {}) => {
    const createdFeedback = await Feedback.create(feedback, options);
    return createdFeedback;
  };

