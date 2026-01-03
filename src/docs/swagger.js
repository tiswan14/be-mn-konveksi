import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const isProduction = process.env.NODE_ENV === "production";

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MN Konveksi API",
            version: "1.0.0",
            description: "API resmi MN Konveksi",
        },
        servers: [
            {
                url: isProduction
                    ? "https://be-mn-konveksi.vercel.app"
                    : "http://localhost:5000",
                description: isProduction ? "Production" : "Local",
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
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/docs/*.swagger.js"],
});

export const swaggerDocs = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle: "MN Konveksi API Docs",
        })
    );
};
