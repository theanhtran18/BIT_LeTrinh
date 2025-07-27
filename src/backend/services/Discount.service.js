/**
 * CRUD operations for Discounts
 * @module services/Discount.service
 */

const {
  Discount,
  DiscountCondition,
  Order,
  Customer,
  Product,
  OrderDiscount,
} = require("../models");
const Sequelize = require("sequelize");

/**
 * Get all discounts
 * @returns {Promise<Discount[]>} A promise that contains the discounts
 *
 */

exports.getAllDiscounts = async () => {
  return await Discount.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: DiscountCondition,
        as: "conditions",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Order,
        as: "orders",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        through: {
          attributes: ["applied_at", "discount_amount"],
          as: "OrderDiscount",
        },
        order: [["OrderDiscount", "applied_at", "DESC"]],

        include: [
          {
            model: Customer,
            as: "customer",
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token"],
            },
          },
          {
            model: Product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            through: {
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              as: "OrderProduct",
            },
          },
        ],
      },
    ],
  });
};

/**
 * Get a discount by id
 * @param {string} id - The id of the discount
 * @returns {Promise<Discount>} A promise that contains the discount
 *
 */
exports.getDiscountById = async (id) => {
  return await Discount.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: DiscountCondition,
        as: "conditions",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Order,
        as: "orders",
        attributes: {
          exclude: ["createdAt", "updatedAt", "order_id"],
        },
      },
    ],
  });
};

/**
 * Get a discount by code
 * @param {string} code - The code of the discount
 * @returns {Promise<Discount>} A promise that contains the discount
 *
 */
exports.getDiscountByCode = async (code) => {
  return await Discount.findOne({
    where: {
      code: {
        [Sequelize.Op.like]: `%${code}%`,
      },
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: DiscountCondition,
        as: "conditions",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: Order,
        as: "orders",
        attributes: {
          exclude: ["createdAt", "updatedAt", "order_id"],
        },
      },
    ],
  });
};

/**
 * Create a discount
 * @param {Object} discount - The discount object
 * @param {Object} options - The transaction options
 * @returns {Promise<Discount>} A promise that contains the discount
 *
 */
exports.createDiscount = async (discount, options = {}) => {
  discount.start_date
    ? (discount.start_date = new Date(discount.start_date))
    : (discount.start_date = new Date("1970-01-01"));
  discount.end_date
    ? (discount.end_date = new Date(discount.end_date))
    : (discount.end_date = new Date("9999-12-31"));
  if (discount.start_date > discount.end_date) {
    throw new Error("The start date must be before the end date");
  }

  const createdDiscount = await Discount.create(discount, options);

  if (discount.conditions) {
    const conditions = discount.conditions.map((condition) => {
      condition.value = condition.value || 0;
      condition.discount_id = createdDiscount.id;
      return condition;
    });
    delete discount.conditions;
    await DiscountCondition.bulkCreate(conditions, options);
  }

  const { createdAt, updatedAt, ...result } = createdDiscount.dataValues;
  return result;
};

/**
 * Update a discount
 * @param {string} id - The id of the discount
 * @param {Object} discount - The discount object
 * @param {Object} options - The transaction options
 * @returns {Promise<Discount>} A promise that contains the discount
 *
 */
exports.updateDiscount = async (id, discount, options = {}) => {
  const updatedDiscount = await Discount.update(
    discount,
    {
      where: {
        id,
      },
    },
    options
  );

  if (
    discount.conditions &&
    discount.conditions.length > 0 &&
    updatedDiscount[0]
  ) {
    await DiscountCondition.destroy({
      where: {
        discount_id: id,
      },
      ...options,
    });

    const conditions = discount.conditions.map((condition) => {
      condition.discount_id = id;
      return condition;
    });
    await DiscountCondition.bulkCreate(conditions, options);
  }
  return updatedDiscount;
};

/**
 * Delete a discount
 * @param {string} id - The id of the discount
 * @param {Object} options - The transaction options
 * @returns {Promise<Discount>} A promise that contains the discount
 *
 */
exports.deleteDiscount = async (id, options = {}) => {
  let discountToBeDelete = await Discount.findByPk(id, options);

  if (!discountToBeDelete) {
    discountToBeDelete = await Discount.findOne({
      where: {
        code: id,
      },
      ...options,
    });
  }

  if (!discountToBeDelete) {
    throw new Error("Discount not found");
  }

  await DiscountCondition.destroy({
    where: {
      discount_id: discountToBeDelete.id,
    },
    ...options,
  });
  return await Discount.destroy({
    where: {
      id: discountToBeDelete.id,
    },
    ...options,
  });
};

/**
 * Get all discount conditions types
 * @returns {Promise<string[]>} A promise that contains the discount conditions types
 *
 */

exports.getDiscountConditionsTypes = async () => {
  return await DiscountCondition.findAll({
    attributes: [
      [
        Sequelize.fn("DISTINCT", Sequelize.col("conditionType")),
        "conditionType",
      ],
    ],
  })
    .then((types) => {
      return types.map((type) => type.conditionType);
    })
    .catch((error) => {
      console.error("Error", error);
      throw error;
    });
};

/**
 * Get all orders that use a discount
 *
 * @param {string} id - The id of the discount
 * @returns {Promise<Order[]>} A promise that contains the orders
 *
 *
 */
exports.getOrdersByDiscountId = async (id) => {
  const discount = await Discount.findByPk(id, {
    attributes: [],
    include: [
      {
        model: Order,
        as: "orders",
        attributes: {
          exclude: ["createdAt", "updatedAt", "order_id", "customer_id"],
        },
        through: {
          attributes: ["applied_at"],
          as: "OrderDiscount",
        },
        include: [
          {
            model: Customer,
            as: "customer",
            attributes: {
              exclude: ["createdAt", "updatedAt", "refresh_token"],
            },
          },
          {
            model: Product,
            as: "products",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            through: {
              attributes: ["quantity"],
              as: "OrderProduct",
            },
          },
        ],
      },
    ],
  });

  const responseFormat = discount.orders.map((order) => {
    const orderData = order.toJSON();

    const details = orderData.products.map((product) => {
      const productData = product;
      productData.quantity = product.OrderProduct.quantity;
      delete productData.OrderProduct;
      return productData;
    });
    orderData.details = details;
    orderData.applied_at = order.OrderDiscount.applied_at;

    delete orderData.OrderDiscount;
    delete orderData.products;

    return orderData;
  });
  return responseFormat;
};

/**
 * Apply a discount to an order
 *
 * @param {string} discountCode - The code of the discount
 * @param {Object} order - The order object
 * @param {Object} options - The transaction options
 * @returns {Promise<Object>} A promise that contains the order
 * @throws {Error} If the discount is not found
 * @throws {Error} If the discount is not applicable
 * @throws {Error} If the discount is expired
 * @throws {Error} If the discount is already applied
 */
exports.CheckApplyDiscountToOrder = async (
  discountCode,
  order,
  options = {}
) => {
  const discount = await Discount.findOne({
    where: {
      code: discountCode,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: DiscountCondition,
        as: "conditions",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!discount) {
    return {
      error: "Discount not found",
      status: "inApplicable",
    };
  }

  const today = new Date();
  if (today < discount.start_date || today > discount.end_date) {
    return {
      error: "Discount is expired",
      status: "inApplicable",
    };
  }

  const conditions = discount.conditions.map((condition) => {
    condition.discount_id = discount.id;
    return condition;
  });

  const first_order = await Order.count({
    where: {
      customer_id: order.customer_id,
    },
  });

  let message = "";

  const isApplicable = conditions.every((condition) => {
    switch (condition.conditionType) {
      case "MIN_VALUE":
        const check_minValue = order.total_amount >= condition.value;

        if (!check_minValue) {
          message = "Đơn hàng không đạt giá trị tối thiểu";
        }
        return check_minValue;
      case "TOTAL_QUANTITY":
        const check_total_quantity = order.total_quantity >= condition.value;

        if (check_total_quantity) {
          message = "Tổng số lượng sản phẩm không đạt giá trị tối thiểu";
        }
        return check_total_quantity;
      case "FIRST_ORDER":
        const check_FIRST_ORDER = first_order === 0;
        if (!check_FIRST_ORDER) {
          message = "Mã giảm giá chỉ áp dụng cho đơn hàng đầu tiên";
        }
        return check_FIRST_ORDER;
      case "MAX_DISCOUNT_VALUE":
        if (options.isGet) {
          return true;
        }

        const check_maxDiscountValue =
          discount.type === "value"
            ? order.total_amount - discount.value > condition.value
            : order.total_amount * (1 - discount.value / 100) > condition.value;
        if (check_maxDiscountValue) {
          console.log("Set order.total_amount with max discount value");
          order.total_amount = condition.value;
        }
        return true;
      default:
        return false;
    }
  });
  if (!isApplicable) {
    return {
      error: message,
      status: "inApplicable",
    };
  }

  return {
    discount: discount,
    status: "applicable",
  };
};

/**
 * Get all discounts that are applicable to an order
 * @param {Object} order - The order object
 * @returns {Promise<Discount[]>} A promise that contains the discounts
 * @throws {Error} If the discount is not found
 *
 */

exports.getDiscountsApplicableToOrder = async (order) => {
  if (!order) {
    throw new Error("Order is required");
  }
  const discounts = await Discount.findAll({
    where: {
      start_date: {
        [Sequelize.Op.lte]: new Date(),
      },
      end_date: {
        [Sequelize.Op.gte]: new Date(),
      },
    },

    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: DiscountCondition,
        as: "conditions",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });

  const applicableDiscounts = await Promise.all(
    discounts.map(async (discount) => {
      const check = await this.CheckApplyDiscountToOrder(discount.code, order, {
        isGet: true,
      });
      return check.status === "applicable" ? discount : null;
    })
  );

  const filteredDiscounts = applicableDiscounts.filter(Boolean);

  return filteredDiscounts;
};

exports.createOrderDiscount = async (order, discount_id, options = {}) => {
  const discount = await Discount.findByPk(discount_id, {
    attributes: ["id", "code"],
  });
  if (!discount) {
    throw new Error("Discount not found");
  }
  const checkAplyDiscount = await this.CheckApplyDiscountToOrder(
    discount.code,
    order,
    options
  );

  if (checkAplyDiscount.status === "applicable") {
    await OrderDiscount.create(
      {
        order_id: order.id,
        discount_id: discount.id,
        applied_at: new Date(),
        discount_amount: order?.discount_value || 0,
      },
      options
    );
    return discount;
  } else {
    return checkAplyDiscount;
  }
};
