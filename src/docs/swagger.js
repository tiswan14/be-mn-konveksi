import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MN Konveksi API",
            version: "1.0.0",
            description: "Dokumentasi API MN Konveksi",
        },
        servers: [
            {
                url: "https://be-mn-konveksi.vercel.app",
                description: "Production server",
            },
            {
                url: "http://localhost:5000",
                description: "Local server",
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

    // 🔥 INI KUNCI PEMISAHAN
    apis: ["./src/docs/*.swagger.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
