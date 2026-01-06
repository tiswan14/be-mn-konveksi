import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { swaggerSpec } from "./docs/swagger.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import produkRoutes from "./routes/produk.routes.js";
import pesananRoutes from "./routes/pesanan.routes.js";
import transaksiRoutes from "./routes/transaksi.routes.js";
import laporanRoutes from "./routes/admin.laporan.route.js";

const app = express();

// ======================================================
// TRUST PROXY (WAJIB UNTUK VERCEL)
// ======================================================
app.set("trust proxy", 1);

// ======================================================
// SECURITY HEADERS
// ======================================================
app.use(helmet());

// ======================================================
// RATE LIMIT
// ======================================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// ======================================================
// CORS (SUDAH HANDLE PREFLIGHT OTOMATIS)
// ======================================================
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://mn-konveksi.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ======================================================
// BODY PARSER & LOGGER
// ======================================================
app.use(express.json());
app.use(morgan("dev"));

// ======================================================
// STATIC FILE
// ======================================================
app.use(express.static("public"));

// ======================================================
// ROOT
// ======================================================
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "✨ Welcome to MN Konveksi API",
        service: "Backend API",
    });
});

// ======================================================
// OPENAPI JSON (PUBLIC)
// ======================================================
app.get("/openapi.json", cors({ origin: "*" }), (req, res) => {
    res.json(swaggerSpec);
});

// ======================================================
// ROUTES
// ======================================================
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/transaksi", transaksiRoutes);
app.use("/api/laporan", laporanRoutes);

// ======================================================
// 404 HANDLER (WAJIB, TANPA "*")
// ======================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan",
    });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================
app.use((err, req, res, next) => {
    console.error(err);

    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            success: false,
            message: "CORS tidak diizinkan",
        });
    }

    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
    });
});

export default app;
