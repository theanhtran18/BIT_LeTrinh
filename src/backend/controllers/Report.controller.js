const {
  getReportSalesSummaryEveryDate,
  getReportByMonth, // Renamed to reflect the monthly report logic
} = require("../services/Report.service");

exports.getReportSalesSummary = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const year = req.query.year;

    if (year) {
      const report = await getReportByMonth(year);
      return res.status(200).json(report);
    } else {
      const report = await getReportSalesSummaryEveryDate(startDate, endDate);
      return res.status(200).json(report);
    }
  } catch (error) {
    console.error("Error in getReportSalesSummary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
