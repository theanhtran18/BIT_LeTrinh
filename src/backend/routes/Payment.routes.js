const router = require("express").Router();
const paymentController = require("../controllers/Payment.controller.js");
const { protect } = require("../middlewares/authenMiddleware.js");

router.get("/", paymentController.getAllPayments);
router.get("/:id", paymentController.getPaymentById);
router.post("/", paymentController.createPayment);
router.put("/:id", protect, paymentController.updatePayment);
router.delete("/:id", protect, paymentController.deletePayment);

module.exports = router;
