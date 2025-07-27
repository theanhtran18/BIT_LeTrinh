const router = require("express").Router();
const feedbackController = require("../controllers/Feedback.controller");
// const { protect } = require("../middlewares/authenMiddleware");

// Định nghĩa các route cho Feedback
router.get('/:id', feedbackController.getFeedback);
router.get('/', feedbackController.getAllFeedbacks);
router.get('/:id/feedbacks', feedbackController.getFeedbacksByUserId);

router.post('/', feedbackController.createFeedback);


module.exports = router;