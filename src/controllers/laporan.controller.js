import laporanService from "../services/laporan.service.js";

// ===============================
// LAPORAN CONTROLLER
// ===============================
class LaporanController {
    // ===============================
    // PENDAPATAN
    // ===============================
    async laporanPendapatanHarian(req, res) {
        try {
            const { tanggal } = req.query;
            if (!tanggal) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter tanggal wajib diisi",
                });
            }

            const data = await laporanService.laporanPendapatanHarian(tanggal);

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async laporanPendapatanBulanan(req, res) {
        try {
            const { bulan, tahun } = req.query;
            if (!bulan || !tahun) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter bulan dan tahun wajib diisi",
                });
            }

            const data = await laporanService.laporanPendapatanBulanan(
                Number(bulan),
                Number(tahun)
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async laporanPendapatanTahunan(req, res) {
        try {
            const { tahun } = req.query;
            if (!tahun) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter tahun wajib diisi",
                });
            }

            const data = await laporanService.laporanPendapatanTahunan(
                Number(tahun)
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ===============================
    // PESANAN
    // ===============================
    async laporanPesananStatus(req, res) {
        try {
            const data = await laporanService.laporanPesananStatus();
            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async laporanPesananHarian(req, res) {
        try {
            const { tanggal } = req.query;
            if (!tanggal) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter tanggal wajib diisi",
                });
            }

            const data = await laporanService.laporanPesananHarian(tanggal);

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async laporanPesananBulanan(req, res) {
        try {
            const { bulan, tahun } = req.query;
            if (!bulan || !tahun) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter bulan dan tahun wajib diisi",
                });
            }

            const data = await laporanService.laporanPesananBulanan(
                Number(bulan),
                Number(tahun)
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    async laporanPesananTahunan(req, res) {
        try {
            const { tahun } = req.query;
            if (!tahun) {
                return res.status(400).json({
                    success: false,
                    message: "Parameter tahun wajib diisi",
                });
            }

            const data = await laporanService.laporanPesananTahunan(
                Number(tahun)
            );

            res.json({
                success: true,
                data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

const controller = new LaporanController();

// ===============================
// NAMED EXPORT (WAJIB UNTUK ROUTES)
// ===============================
export const laporanPendapatanHarian =
    controller.laporanPendapatanHarian.bind(controller);

export const laporanPendapatanBulanan =
    controller.laporanPendapatanBulanan.bind(controller);

export const laporanPendapatanTahunan =
    controller.laporanPendapatanTahunan.bind(controller);

export const laporanPesananStatus =
    controller.laporanPesananStatus.bind(controller);

export const laporanPesananHarian =
    controller.laporanPesananHarian.bind(controller);

export const laporanPesananBulanan =
    controller.laporanPesananBulanan.bind(controller);

export const laporanPesananTahunan =
    controller.laporanPesananTahunan.bind(controller);

// ⛔ optional: default export boleh DIHAPUS
export default controller;

