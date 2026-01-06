import express from "express";
import {
    laporanPendapatanHarian,
    laporanPendapatanBulanan,
    laporanPendapatanTahunan,
    laporanPesananStatus,
    laporanPesananHarian,
    laporanPesananBulanan,
    laporanPesananTahunan,
} from "../controllers/laporan.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// ===============================
// ADMIN ONLY - LAPORAN PENDAPATAN
// ===============================

// 🔹 Pendapatan Harian
// GET /api/laporan/pendapatan/harian?tanggal=2026-01-05
router.get(
    "/pendapatan/harian",
    auth(),
    requireAdmin,
    laporanPendapatanHarian
);

// 🔹 Pendapatan Bulanan
// GET /api/laporan/pendapatan/bulanan?bulan=1&tahun=2026
router.get(
    "/pendapatan/bulanan",
    auth(),
    requireAdmin,
    laporanPendapatanBulanan
);

// 🔹 Pendapatan Tahunan
// GET /api/laporan/pendapatan/tahunan?tahun=2026
router.get(
    "/pendapatan/tahunan",
    auth(),
    requireAdmin,
    laporanPendapatanTahunan
);

// ===============================
// ADMIN ONLY - LAPORAN PESANAN
// ===============================

// 🔹 Pesanan Berdasarkan Status
// GET /api/laporan/pesanan/status
router.get(
    "/pesanan/status",
    auth(),
    requireAdmin,
    laporanPesananStatus
);

// 🔹 Pesanan Harian
// GET /api/laporan/pesanan/harian?tanggal=2026-01-05
router.get(
    "/pesanan/harian",
    auth(),
    requireAdmin,
    laporanPesananHarian
);

// 🔹 Pesanan Bulanan
// GET /api/laporan/pesanan/bulanan?bulan=1&tahun=2026
router.get(
    "/pesanan/bulanan",
    auth(),
    requireAdmin,
    laporanPesananBulanan
);

// 🔹 Pesanan Tahunan
// GET /api/laporan/pesanan/tahunan?tahun=2026
router.get(
    "/pesanan/tahunan",
    auth(),
    requireAdmin,
    laporanPesananTahunan
);

export default router;
