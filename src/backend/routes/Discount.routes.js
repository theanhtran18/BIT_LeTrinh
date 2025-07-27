const router = require("express").Router();
const discountController = require("../controllers/Discount.controller");
const { protect } = require("../middlewares/authenMiddleware");

router.get("/", discountController.getAllDiscounts);
router.get("/id/:id", discountController.getDiscountById);
router.get("/code/:code", discountController.getDiscountByCode);
router.get("/conditions-type", discountController.getDiscountConditionsTypes);
router.get("/orders/:id", discountController.getOrdersByDiscountId);
router.post("/applicable", discountController.getDiscountsApplicable);


router.post("/", protect, discountController.createDiscount);
router.post("/check", discountController.CheckApplyDiscountToOrder);
router.put("/:id", protect, discountController.updateDiscount);
router.delete("/:id", protect, discountController.deleteDiscount);

module.exports = router;
