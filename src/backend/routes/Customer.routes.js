const router = require("express").Router();
const customerController = require("../controllers/Customer.controller");
const { protect } = require("../middlewares/authenMiddleware");

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.get("/:id/orders", customerController.getOrdersByCustomerId);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
