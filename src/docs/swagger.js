import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MN Konveksi API",
            version: "1.0.0",
            description: "Dokumentasi API MN Konveksi",
        },
        servers: [
            { url: "https://be-mn-konveksi.vercel.app" },
            { url: "http://localhost:5000" },
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
    apis: ["./src/docs/*.swagger.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
