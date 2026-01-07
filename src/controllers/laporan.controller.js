import laporanService from "../services/laporan.service.js";
import { pesananPDF } from "../utils/pesanan.pdf.js";
import { pesananExcel } from "../utils/pesanan.excel.js";

import { ok, badRequest, serverError } from "../utils/response.js";
import { requireQuery } from "../utils/validateQuery.js";

class LaporanController {

    // ===============================
    // PENDAPATAN
    // ===============================
    laporanPendapatanHarian = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["tanggal"])) return;

            const data = await laporanService.laporanPendapatanHarian(
                req.query.tanggal
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    laporanPendapatanBulanan = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["bulan", "tahun"])) return;

            const data = await laporanService.laporanPendapatanBulanan(
                Number(req.query.bulan),
                Number(req.query.tahun)
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    laporanPendapatanTahunan = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["tahun"])) return;

            const data = await laporanService.laporanPendapatanTahunan(
                Number(req.query.tahun)
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    // ===============================
    // PESANAN
    // ===============================
    laporanPesananStatus = async (_req, res) => {
        try {
            const data = await laporanService.laporanPesananStatus();
            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    laporanPesananHarian = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["tanggal"])) return;

            const data = await laporanService.laporanPesananHarian(
                req.query.tanggal
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    laporanPesananBulanan = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["bulan", "tahun"])) return;

            const data = await laporanService.laporanPesananBulanan(
                Number(req.query.bulan),
                Number(req.query.tahun)
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    laporanPesananTahunan = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["tahun"])) return;

            const data = await laporanService.laporanPesananTahunan(
                Number(req.query.tahun)
            );

            ok(res, data);
        } catch (error) {
            serverError(res, error);
        }
    };

    // ===============================
    // CETAK LAPORAN PESANAN
    // ===============================
    laporanPesananCetak = async (req, res) => {
        try {
            if (!requireQuery(res, req.query, ["from", "to"])) return;

            const { from, to, status, format = "json" } = req.query;

            const allowedStatus = [
                "MENUNGGU_PEMBAYARAN",
                "DIPROSES",
                "SELESAI",
                "DIBATALKAN"
            ];

            if (status && !allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Status pesanan tidak valid",
                });
            }


            const result = await laporanService.laporanPesanan({
                from,
                to,
                statusPesanan: status,
            });

            // ===============================
            // MODE JSON (DEBUG)
            // ===============================
            if (format === "json") {
                return res.json({
                    success: true,
                    mode: "json",
                    result,
                });
            }

            // ===============================
            // MODE PDF
            // ===============================
            if (format === "pdf") {
                return pesananPDF(res, result);
            }

            // ===============================
            // MODE EXCEL
            // ===============================
            if (format === "excel") {
                return pesananExcel(res, result);
            }

            // ===============================
            // FORMAT TIDAK VALID
            // ===============================
            return res.status(400).json({
                success: false,
                message: "Format tidak valid. Gunakan: json | pdf | excel",
            });

        } catch (error) {
            serverError(res, error);
        }
    };


}

const controller = new LaporanController();

export const laporanPendapatanHarian = controller.laporanPendapatanHarian;
export const laporanPendapatanBulanan = controller.laporanPendapatanBulanan;
export const laporanPendapatanTahunan = controller.laporanPendapatanTahunan;

export const laporanPesananStatus = controller.laporanPesananStatus;
export const laporanPesananHarian = controller.laporanPesananHarian;
export const laporanPesananBulanan = controller.laporanPesananBulanan;
export const laporanPesananTahunan = controller.laporanPesananTahunan;
export const laporanPesananCetak = controller.laporanPesananCetak;

export default controller;
