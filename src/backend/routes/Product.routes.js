/**
 * @swagger
 * /products:
 *
 */

const router = require("express").Router();
const productController = require("../controllers/Product.controller");
const { protect } = require("../middlewares/authenMiddleware");
const upload = require("../middlewares/MulterFileStorage");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  protect,
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/:id",
  upload.single("image"),
  productController.updateProduct
);
router.delete("/:id", protect, productController.deleteProduct);
router.get("/:id/categories", productController.getCategoriesByProduct);
router.get("/category/id/:id", productController.getProductsByCategoryId);
router.get("/category/name/:name", productController.getProductsByCategoryName);

router.post(
  "/:id/upload",
  upload.single("image"),
  protect,
  productController.updateImage
);

module.exports = router;
