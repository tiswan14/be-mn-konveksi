import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// routes
import authRoutes from "./routes/auth.routes.js";
import produkRoutes from "./routes/produk.routes.js";

const app = express();

// ===========================
// SECURITY MIDDLEWARE
// ===========================

// Helmet (mengatur header keamanan)
app.use(helmet());

// Rate limit (anti brute force & spam)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 200, // max request per IP
    message: "Terlalu banyak request dari IP ini, coba lagi nanti."
});
app.use(limiter);

// ===========================
// CORS WHITELIST (HANYA IZINKAN React JS)
// ===========================
const whitelist = [
    "http://localhost:5173",   // React Vite
    "http://localhost:3000",   // React CRA
    "https://mn-konveksi.vercel.app" // jika sudah online
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// ===========================
// BODY PARSER + LOGGER
// ===========================
app.use(express.json());
app.use(morgan("dev"));

// ===========================
// HOME ENDPOINT
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
// ROUTES
// ===========================
app.use("/api/auth", authRoutes);
app.use("/api/produk", produkRoutes);

export default app;
