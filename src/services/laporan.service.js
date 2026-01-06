import laporanRepo from "../repositories/laporan.repository.js";

// ===============================
// LAPORAN SERVICE
// ===============================
class LaporanService {
    // ===============================
    // PENDAPATAN
    // ===============================
    async laporanPendapatanHarian(tanggal) {
        const start = new Date(`${tanggal}T00:00:00Z`);
        const end = new Date(`${tanggal}T23:59:59Z`);

        const result = await laporanRepo.pendapatanByRange(start, end);

        return {
            tanggal,
            total_transaksi: result._count.id_transaksi || 0,
            total_pendapatan: result._sum.jumlah || 0,
        };
    }

    async laporanPendapatanBulanan(bulan, tahun) {
        const start = new Date(tahun, bulan - 1, 1);
        const end = new Date(tahun, bulan, 0, 23, 59, 59);

        const result = await laporanRepo.pendapatanByRange(start, end);

        return {
            bulan,
            tahun,
            total_transaksi: result._count.id_transaksi || 0,
            total_pendapatan: result._sum.jumlah || 0,
        };
    }

    async laporanPendapatanTahunan(tahun) {
        const start = new Date(`${tahun}-01-01T00:00:00Z`);
        const end = new Date(`${tahun}-12-31T23:59:59Z`);

        const result = await laporanRepo.pendapatanByRange(start, end);

        return {
            tahun,
            total_transaksi: result._count.id_transaksi || 0,
            total_pendapatan: result._sum.jumlah || 0,
        };
    }

    // ===============================
    // PESANAN
    // ===============================
    async laporanPesananStatus() {
        return laporanRepo.pesananByStatus();
    }

    async laporanPesananHarian(tanggal) {
        const start = new Date(`${tanggal}T00:00:00Z`);
        const end = new Date(`${tanggal}T23:59:59Z`);

        const result = await laporanRepo.pesananByRange(start, end);

        return {
            tanggal,
            total_pesanan: result._count.id_pesanan || 0,
        };
    }

    async laporanPesananBulanan(bulan, tahun) {
        const start = new Date(tahun, bulan - 1, 1);
        const end = new Date(tahun, bulan, 0, 23, 59, 59);

        const result = await laporanRepo.pesananByRange(start, end);

        return {
            bulan,
            tahun,
            total_pesanan: result._count.id_pesanan || 0,
        };
    }

    async laporanPesananTahunan(tahun) {
        const start = new Date(`${tahun}-01-01T00:00:00Z`);
        const end = new Date(`${tahun}-12-31T23:59:59Z`);

        const result = await laporanRepo.pesananByRange(start, end);

        return {
            tahun,
            total_pesanan: result._count.id_pesanan || 0,
        };
    }
}

export default new LaporanService();
