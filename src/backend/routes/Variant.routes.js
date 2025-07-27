const router = require("express").Router();
const variantController = require("../controllers/Variant.controller");

router.get("/", variantController.getAllVariants);
router.get("/:id", variantController.getVariantById);

module.exports = router;