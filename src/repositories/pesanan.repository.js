import prisma from "../prisma/client.js";

class PesananRepository {

    // ===============================
    // PRODUK (UNTUK PESANAN)
    // ===============================
    async findProdukById(id_produk) {
        return prisma.produk.findUnique({
            where: { id_produk }
        });
    }

    // ===============================
    // GET ALL PESANAN (ADMIN)
    // ===============================
    async findAll() {
        return prisma.pesanan.findMany({
            orderBy: { tanggal_pesan: "desc" },
            select: {
                id_pesanan: true,
                qty: true,
                harga_satuan: true,
                total_harga: true,
                dp_wajib: true,
                estimasi_hari: true,
                catatan: true,
                status_pesanan: true,
                dp_status: true,
                pelunasan_status: true,
                tanggal_pesan: true,

                user: {
                    select: {
                        id_user: true,
                        nama: true,
                        email: true,
                        no_hp: true
                    }
                },

                produk: {
                    select: {
                        id_produk: true,
                        nama_produk: true,
                        harga: true,
                        bahan: true,
                        foto: true
                    }
                },

                transaksi: {
                    select: {
                        id_transaksi: true,
                        jenis_pembayaran: true,
                        jumlah: true,
                        midtrans_status: true,
                        created_at: true
                    }
                }
            }
        });
    }


    // ===============================
    // CREATE
    // ===============================
    async create(data) {
        return prisma.pesanan.create({ data });
    }

    // ===============================
    // DETAIL PESANAN
    // ===============================
    async findById(id_pesanan) {
        return prisma.pesanan.findUnique({
            where: { id_pesanan },
            select: {
                id_pesanan: true,
                qty: true,
                harga_satuan: true,
                total_harga: true,
                dp_wajib: true,
                catatan: true,
                status_pesanan: true,
                dp_status: true,
                pelunasan_status: true,
                tanggal_pesan: true,

                user: {
                    select: {
                        id_user: true,
                        nama: true,
                        email: true,
                        no_hp: true
                    }
                },

                produk: {
                    select: {
                        id_produk: true,
                        nama_produk: true,
                        harga: true,
                        bahan: true,
                        foto: true
                    }
                },

                transaksi: {
                    select: {
                        id_transaksi: true,
                        jenis_pembayaran: true,
                        jumlah: true,
                        midtrans_status: true,
                        created_at: true
                    }
                }
            }
        });
    }


    // ===============================
    // PESANAN USER (SINKRON DENGAN findById)
    // ===============================
    async findByUser(id_user) {
        return prisma.pesanan.findMany({
            where: { id_user },
            orderBy: { tanggal_pesan: "desc" },
            select: {
                id_pesanan: true,
                qty: true,
                harga_satuan: true,
                total_harga: true,
                dp_wajib: true,
                catatan: true,
                status_pesanan: true,
                dp_status: true,
                pelunasan_status: true,
                tanggal_pesan: true,

                user: {
                    select: {
                        id_user: true,
                        nama: true,
                        email: true,
                        no_hp: true
                    }
                },

                produk: {
                    select: {
                        id_produk: true,
                        nama_produk: true,
                        harga: true,
                        bahan: true,
                        foto: true
                    }
                },

                transaksi: {
                    select: {
                        id_transaksi: true,
                        jenis_pembayaran: true,
                        jumlah: true,
                        midtrans_status: true,
                        created_at: true
                    }
                }
            }
        });
    }


    // ===============================
    // UPDATE STATUS
    // ===============================
    async updateStatus(id_pesanan, data) {
        return prisma.pesanan.update({
            where: { id_pesanan },
            data
        });
    }

    // ===============================
    // DASHBOARD CUSTOMER
    // ===============================
    async getSummaryByUser(id_user) {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            where: { id_user },
            _count: { _all: true }
        });
    }

    // ===============================
    // DASHBOARD ADMIN
    // ===============================
    async getSummaryAll() {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            _count: { _all: true }
        });
    }

    // ===============================
    // TOTAL PESANAN
    // ===============================
    async countByUser(id_user) {
        return prisma.pesanan.count({
            where: { id_user }
        });
    }

    async countAll() {
        return prisma.pesanan.count();
    }

    // ===============================
    // TOTAL PENDAPATAN (ADMIN)
    // ===============================
    async getTotalPendapatan() {
        const result = await prisma.transaksiPembayaran.aggregate({
            where: {
                midtrans_status: "settlement"
            },
            _sum: {
                jumlah: true
            }
        });

        return result._sum.jumlah ?? 0;
    }
    // ===============================
    // DETAIL PESANAN + TRANSAKSI (UNTUK DELETE)
    // ===============================
    async findByIdWithTransaksi(id_pesanan) {
        return prisma.pesanan.findUnique({
            where: { id_pesanan },
            include: {
                transaksi: true
            }
        });
    }

    // ===============================
    // DELETE PESANAN
    // ===============================
    async deleteById(id_pesanan) {
        return prisma.pesanan.delete({
            where: { id_pesanan }
        });
    }

    // ===============================
    // DELETE TRANSAKSI PESANAN
    // ===============================
    async deleteTransaksiByPesanan(id_pesanan) {
        return prisma.transaksiPembayaran.deleteMany({
            where: { id_pesanan }
        });
    }

}



export default new PesananRepository();
