import express from "express";
import {
    createPesanan,
    getPesananUser,
    getDetailPesanan,
    updateStatusPesanan,
    getPesananSummaryUser,
    getPesananSummaryAdmin,
} from "../controllers/pesanan.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// ===============================
// CUSTOMER
// ===============================
router.post("/", auth(), createPesanan);
router.get("/me", auth(), getPesananUser);

// 🔹 DASHBOARD CUSTOMER (SUMMARY)
router.get("/me/summary", auth(), getPesananSummaryUser);

// ===============================
// DETAIL PESANAN
// ===============================
router.get("/:id", auth(), getDetailPesanan);

// ===============================
// ADMIN ONLY
// ===============================
router.patch("/:id/status", auth(), requireAdmin, updateStatusPesanan);

// 🔹 DASHBOARD ADMIN (SUMMARY)
router.get("/admin/summary", auth(), requireAdmin, getPesananSummaryAdmin);

export default router;
