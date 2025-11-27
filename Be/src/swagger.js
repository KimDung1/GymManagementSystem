import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gym Management API",
            version: "1.0.0",
            description: "API documentation for Gym Management System",
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Local server",
            },
            {
                url: "https://mangement-gym.onrender.com",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },

    // 👇 QUAN TRỌNG: quét toàn bộ file route của bạn
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    // Hiển thị giao diện Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log("📄 Swagger docs available at /api-docs");
};
