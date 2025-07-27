const router = require("express").Router();
const AdminController = require("../controllers/Admin.controller");
const { systemAdmin } = require("../middlewares/authenMiddleware");

router.get("/", AdminController.getAdmins);
router.post("/", AdminController.createAdmin);
router.post("/check", AdminController.checkAdmin);
router.post("/refresh", AdminController.refreshToken);
router.get("/:id", AdminController.getAdminById);
router.put("/:id", systemAdmin, AdminController.updateAdmin);
router.delete("/:id", systemAdmin, AdminController.deleteAdmin);

module.exports = router;
