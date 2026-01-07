import prisma from "../prisma/client.js";

class LaporanRepository {

    // ===============================
    // PENDAPATAN (KEUANGAN)
    // ===============================
    pendapatanByRange(startDate, endDate) {
        return prisma.transaksiPembayaran.aggregate({
            _sum: { jumlah: true },
            _count: { id_transaksi: true },
            where: {
                midtrans_status: "settlement",
                jenis_pembayaran: {
                    in: ["FULL", "PELUNASAN"] // DP tidak dihitung lunas
                },
                midtrans_settlement_time: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    }

    // ===============================
    // PESANAN - REKAP STATUS
    // ===============================
    pesananByStatus() {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            _count: { id_pesanan: true }
        });
    }

    // ===============================
    // PESANAN - COUNT RANGE
    // ===============================
    pesananByRange(startDate, endDate) {
        return prisma.pesanan.aggregate({
            _count: { id_pesanan: true },
            where: {
                tanggal_pesan: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    }

    // ===============================
    // PESANAN - DETAIL LAPORAN (PDF / EXCEL)
    // ===============================
    pesananDetailByRange(startDate, endDate, statusPesanan) {
        return prisma.pesanan.findMany({
            where: {
                tanggal_pesan: {
                    gte: startDate,
                    lte: endDate
                },
                ...(statusPesanan && {
                    status_pesanan: statusPesanan
                })
            },
            select: {
                id_pesanan: true,
                qty: true,
                harga_satuan: true,
                total_harga: true,
                status_pesanan: true,
                tanggal_pesan: true,

                user: {
                    select: {
                        nama: true,
                        no_hp: true
                    }
                },

                produk: {
                    select: {
                        nama_produk: true
                    }
                },

                transaksi: {
                    select: {
                        jenis_pembayaran: true,
                        jumlah: true,
                        midtrans_status: true,
                    }
                }
            },
            orderBy: {
                tanggal_pesan: "asc"
            }
        });
    }
}

export default new LaporanRepository();
