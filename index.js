const express = require("express");
const dotenv = require("dotenv");
const insertDataToDB = require("./src/backend/utils/insertDataToDB");
const CORS = require("cors");
const productRouter = require("./src/backend/routes/Product.routes");
const orderRouter = require("./src/backend/routes/Order.routes");
const paymentRouter = require("./src/backend/routes/Payment.routes");
const categoryRouter = require("./src/backend/routes/Category.routes");
const variantRouter = require("./src/backend/routes/Variant.routes");
const customerRouter = require("./src/backend/routes/Customer.routes");
const discountRouter = require("./src/backend/routes/Discount.routes");
const adminRouter = require("./src/backend/routes/Admin.routes");
const dashboardRouter = require("./src/backend/routes/Report.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./src/backend/swagger.json");
const feedbackRouter = require("./src/backend/routes/Feedback.routes");
const postRouter = require("./src/backend/routes/Post.routes");

const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CORS());

const options = {
  customCss: ".swagger-ui .topbar { display: none }",
  explorer: true,
};
app.use(
  "/bit-letrinh/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

app.get("/bit-letrinh/api/v1/insert-data", async (req, res) => {
  await insertDataToDB();
  res.send("Data inserted successfully");
});

app.post("/bit-letrinh/api/v1/notification/webhook", (req, res) => {
  console.log(req.body);

  res.send("Hello World");
});
app.post("/bit-letrinh/api/v1/notification/payment", (req, res) => {
  console.log("Payment : ", req.body);
  res.send("Done !");
});

app.use(`/bit-letrinh/api/${process.env.API_VERSION}/product`, productRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/order`, orderRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/payment`, paymentRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/category`, categoryRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/variant`, variantRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/customer`, customerRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/discount`, discountRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/admin`, adminRouter);
app.use(
  `/bit-letrinh/api/${process.env.API_VERSION}/dashboard`,
  dashboardRouter
);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/feedback`, feedbackRouter);
app.use(`/bit-letrinh/api/${process.env.API_VERSION}/post`, postRouter);

const host = process.env.HOST || "localhost"; // Default to 'localhost' if not set
const port = process.env.PORT || 3000; // Default to port 3000 if not set

app.listen(port, host, () => {
  console.log(`Server is running on host ${host} and port ${port}`);
});
