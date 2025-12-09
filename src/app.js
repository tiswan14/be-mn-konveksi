import express from "express";
import cors from "cors";
import morgan from "morgan";

// routes
import authRoutes from "./routes/auth.routes.js";
// import produkRoutes from "./routes/produk.routes.js";
// import pesananRoutes from "./routes/pesanan.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// HOME ENDPOINT
app.get("/", (req, res) => {
    res.json({
        message: "✨ Welcome to MN Konveksi API",
        status: "success",
        author: "MN Konveksi Backend",
        description: "API backend untuk manajemen produk, pesanan, pembayaran DP & pelunasan.",
        docs: "/auth | /produk | /pesanan"
    });
});

// ROUTES
app.use("/api/auth", authRoutes);
// app.use("/produk", produkRoutes);
// app.use("/pesanan", pesananRoutes);

export default app;
