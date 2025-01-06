const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Tour API", // Tiêu đề của API
      version: "1.0.0", // Phiên bản API
      description: "API Documentation for Booking Tour System", // Mô tả
    },
    servers: [
      {
        url: "http://localhost:8000", // URL server (thay đổi nếu cần)
      },
    ],
  },
  apis: ["./routes/*.js"], // Đường dẫn đến file chứa route
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    "Swagger documentation available at http://localhost:8000/api-docs"
  );
};

module.exports = setupSwagger;
