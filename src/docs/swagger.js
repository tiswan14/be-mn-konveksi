import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import swaggerUiDist from "swagger-ui-dist";

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MN Konveksi API",
            version: "1.0.0",
        },
    },
    apis: ["./src/docs/*.swagger.js"],
});

export const swaggerDocs = (app) => {
    const swaggerDistPath = swaggerUiDist.getAbsoluteFSPath();

    // 🔑 INI WAJIB
    app.use("/api-docs", express.static(swaggerDistPath));

    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
        })
    );
};
