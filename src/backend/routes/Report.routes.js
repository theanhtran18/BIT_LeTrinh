/**
 *
 * Report routes
 * @module Report/routes
 *
 *  */

const router = require("express").Router();
const reportController = require("../controllers/Report.controller");
const { protect } = require("../middlewares/authenMiddleware");

router.get("/sales-summary", reportController.getReportSalesSummary);
// router.get("/revenue/:date", protect, reportController.getRevenueByDate);

module.exports = router;
