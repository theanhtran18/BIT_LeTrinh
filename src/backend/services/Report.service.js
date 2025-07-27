/**
 * @api {get} /report/
 * @apiName Get Report Service
 * @apiGroup Report Service
 * @apiPermission admin
 * @apiDescription Get report of all orders, include customer, product, discount, payment
 */

const {
  Order,
  OrderProduct,
  Product,
  Discount,
  OrderDiscount,
  Payment,
} = require("../models");

const sequelize = require("sequelize");

const getReportData = async (startDate, endDate) => {
  try {
    const totalOrders = await getTotalOrders(startDate, endDate);
    const totalRevenue = await getTotalRevenue(startDate, endDate);
    const topSellingProducts = await getTopSellingProducts(startDate, endDate);
    const totalDiscountsApplied = await getTotalDiscountsApplied(
      startDate,
      endDate
    );
    const totalDiscountAmount = await getTotalDiscountAmount(
      startDate,
      endDate
    );
    const discountReport = await getDiscountReport(startDate, endDate);
    const paymentReport = await getPaymentReport(startDate, endDate);

    return {
      totalOrders,
      totalRevenue,
      topSellingProducts,
      totalDiscountsApplied,
      totalDiscountAmount,
      discountReport,
      paymentReport,
    };
  } catch (error) {
    console.error("Error in getReportData:", error);
    throw error;
  }
};

exports.getReportByMonth = async (year) => {
  try {
    const report = [];

    for (let i = 1; i <= 12; i++) {
      const startDate = new Date(year, i - 1, 1);
      const endDate = new Date(year, i, 0);
      const monthlyReport = await getReportData(startDate, endDate);
      report.push({
        month: i,
        ...monthlyReport,
      });
    }

    return report;
  } catch (error) {
    console.error("Error in getReportByMonth:", error);
    throw error;
  }
};

exports.getReportSalesSummaryEveryDate = async (startDate, endDate) => {
  try {
    const report = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vòng lặp qua từng ngày trong khoảng thời gian
    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const queryStartDate = date.toISOString().split("T")[0];

      const queryEndDate = new Date(date);
      queryEndDate.setDate(queryEndDate.getDate() + 1);
      const queryEndDateStr = queryEndDate.toISOString().split("T")[0];

      const dailyReport = await getReportData(queryStartDate, queryEndDateStr);
      report.push({
        date: queryStartDate,
        ...dailyReport,
      });
    }

    return report;
  } catch (error) {
    console.error("Error in getReportSalesSummaryEveryDate:", error);
    throw error;
  }
};

const getTotalOrders = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            order_date: {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const totalOrders = await Order.count({
      where: whereClause,
    });
    return totalOrders;
  } catch (error) {
    console.error("Error in getTotalOrders:", error);
    throw error;
  }
};

const getTotalRevenue = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            order_date: {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const totalRevenue = await Order.sum("total_amount", {
      where: whereClause,
    });
    return totalRevenue;
  } catch (error) {
    console.error("Error in getTotalRevenue:", error);
    throw error;
  }
};

const getTopSellingProducts = async (startDate, endDate, limit = 5) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            "$order.order_date$": {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const topSellingProducts = await OrderProduct.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
        [
          sequelize.fn("SUM", sequelize.col("OrderProduct.price")),
          "totalRevenue",
        ],
      ],
      include: [{ model: Product, as: "product" }],
      group: ["product_id"],
      order: [[sequelize.literal("totalSold"), "DESC"]],
      limit,
      where: whereClause,
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
      ],
    });
    return topSellingProducts;
  } catch (error) {
    console.error("Error in getTopSellingProducts:", error);
    throw error;
  }
};

const getTotalDiscountsApplied = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            "$order.order_date$": {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const totalDiscountsApplied = await OrderDiscount.count({
      where: whereClause,
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
      ],
    });
    return totalDiscountsApplied;
  } catch (error) {
    console.error("Error in getTotalDiscountsApplied:", error);
    throw error;
  }
};

const getTotalDiscountAmount = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            "$order.order_date$": {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {}; // Điều kiện lọc theo ngày nếu có

    const totalDiscountAmount = await OrderDiscount.sum("discount_amount", {
      where: whereClause,
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
        },
      ],
    });
    return totalDiscountAmount;
  } catch (error) {
    console.error("Error in getTotalDiscountAmount:", error);
    throw error;
  }
};

const getRevenueByDate = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            order_date: {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};
    const revenueByDate = await Order.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("order_date")), "date"],
        [sequelize.fn("SUM", sequelize.col("total_amount")), "revenue"],
        [sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
      ],
      where: whereClause,
      group: [sequelize.fn("DATE", sequelize.col("order_date"))],
      order: [[sequelize.fn("DATE", sequelize.col("order_date")), "ASC"]],
    });
    return revenueByDate;
  } catch (error) {
    console.error("Error in getRevenueByDate:", error);
    throw error;
  }
};

const getDiscountReport = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            "$order.order_date$": {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const discountReport = await OrderDiscount.findAll({
      attributes: [
        "discount_id",
        [
          sequelize.fn("COUNT", sequelize.col("OrderDiscount.discount_id")),
          "usageCount",
        ],
        [
          sequelize.fn("SUM", sequelize.col("discount_amount")),
          "totalDiscountAmount",
        ],
      ],
      include: [
        {
          model: Discount,
          as: "discount",
          attributes: ["code"],
        },
        {
          model: Order,
          as: "order",
          attributes: [],
          where: whereClause,
        },
      ],
      group: ["OrderDiscount.discount_id"],
      order: [[sequelize.literal("usageCount"), "DESC"]],
    });

    return discountReport;
  } catch (error) {
    console.error("Error in getDiscountReport:", error);
    throw error;
  }
};

const getPaymentReport = async (startDate, endDate) => {
  try {
    const whereClause =
      startDate && endDate
        ? {
            order_date: {
              [sequelize.Op.between]: [startDate, endDate],
            },
          }
        : {};

    const paymentReport = await Payment.findAll({
      attributes: [
        "status",
        [
          sequelize.fn("COUNT", sequelize.col("Payment.status")),
          "totalPayments",
        ],
        [sequelize.fn("SUM", sequelize.col("Payment.amount")), "totalRevenue"],
      ],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          where: whereClause,
        },
      ],
      group: ["status"],
      order: [[sequelize.literal("totalPayments"), "DESC"]],
    });

    return paymentReport;
  } catch (error) {
    console.error("Error in getPaymentReport:", error);
    throw error;
  }
};
