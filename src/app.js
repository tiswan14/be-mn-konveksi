import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { swaggerSpec } from "./docs/swagger.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import produkRoutes from "./routes/produk.routes.js";
import pesananRoutes from "./routes/pesanan.routes.js";
import transaksiRoutes from "./routes/transaksi.routes.js";

const app = express();

// ===========================
// TRUST PROXY (WAJIB UNTUK VERCEL)
// ===========================
app.set("trust proxy", 1);

// ===========================
// SECURITY
// ===========================
app.use(helmet());

// ===========================
// RATE LIMIT
// ===========================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Terlalu banyak request dari IP ini, coba lagi nanti.",
});
app.use(limiter);

// ===========================
// CORS
// ===========================
const whitelist = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    "https://mn-konveksi.vercel.app",
    "https://be-mn-konveksi.vercel.app",
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// ===========================
// BODY PARSER + LOGGER
// ===========================
app.use(express.json());
app.use(morgan("dev"));

// ===========================
// HOME
// ===========================
app.get("/", (req, res) => {
    res.json({
        message: "✨ Welcome to MN Konveksi API",
        status: "success",
        author: "MN Konveksi Backend",
        description: "API backend untuk manajemen produk, pesanan, & pembayaran.",
    });
});

// ===========================
// OPENAPI JSON (UNTUK SWAGGER UI CDN)
// ===========================
app.get("/openapi.json", (req, res) => {
    // CORS khusus docs
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.json(swaggerSpec);
});

// ===========================
// ROUTES
// ===========================
app.use("/api/auth", authRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/transaksi", transaksiRoutes);

export default app;
