import express from "express";
import {
    createPesanan,
    getPesananUser,
    deletePesanan,
    getDetailPesanan,
    getAllPesanan,
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
router.put("/:id/status", auth(), requireAdmin, updateStatusPesanan);

router.get("/", auth(), requireAdmin, getAllPesanan);


// 🔹 DASHBOARD ADMIN (SUMMARY)
router.get("/admin/summary", auth(), requireAdmin, getPesananSummaryAdmin);

router.delete("/:id", auth(), deletePesanan);


export default router;
