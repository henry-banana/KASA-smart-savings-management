import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "KASA API",
      version: "1.0.0",
      description: "API documentation for KASA Smart Savings Management",
      contact: {
        name: "Your Name",
        email: "your.email@example.com",
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routers/*.js"], // nơi bạn viết comment cho Swagger
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
