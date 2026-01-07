import express from "express";
import {
    laporanPendapatanHarian,
    laporanPendapatanBulanan,
    laporanPendapatanTahunan,
    laporanPesananStatus,
    laporanPesananHarian,
    laporanPesananBulanan,
    laporanPesananTahunan,
    laporanPesananCetak,
} from "../controllers/laporan.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// ===============================
// ADMIN ONLY - LAPORAN PENDAPATAN
// ===============================

router.get("/pendapatan/harian", auth(), requireAdmin, laporanPendapatanHarian);
router.get("/pendapatan/bulanan", auth(), requireAdmin, laporanPendapatanBulanan);
router.get("/pendapatan/tahunan", auth(), requireAdmin, laporanPendapatanTahunan);

// ===============================
// ADMIN ONLY - LAPORAN PESANAN
// ===============================

router.get("/pesanan/status", auth(), requireAdmin, laporanPesananStatus);
router.get("/pesanan/harian", auth(), requireAdmin, laporanPesananHarian);
router.get("/pesanan/bulanan", auth(), requireAdmin, laporanPesananBulanan);
router.get("/pesanan/tahunan", auth(), requireAdmin, laporanPesananTahunan);

// ===============================
// ADMIN ONLY - CETAK LAPORAN
// ===============================

router.get("/pesanan/cetak", laporanPesananCetak);

export default router;
