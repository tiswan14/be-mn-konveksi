import prisma from "../prisma/client.js";

class LaporanRepository {
    // ===============================
    // PENDAPATAN
    // ===============================
    pendapatanByRange(startDate, endDate) {
        return prisma.transaksiPembayaran.aggregate({
            _sum: { jumlah: true },
            _count: { id_transaksi: true },
            where: {
                midtrans_status: "settlement",
                jenis_pembayaran: { in: ["FULL", "PELUNASAN"] },
                midtrans_settlement_time: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
    }

    // ===============================
    // PESANAN
    // ===============================
    pesananByStatus() {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            _count: { id_pesanan: true },
        });
    }

    pesananByRange(startDate, endDate) {
        return prisma.pesanan.aggregate({
            _count: { id_pesanan: true },
            where: {
                tanggal_pesan: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
    }
}

export default new LaporanRepository();
