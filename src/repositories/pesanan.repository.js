import prisma from "../prisma/client.js";

class PesananRepository {

    async create(data) {
        return prisma.pesanan.create({ data });
    }

    async findById(id_pesanan) {
        return prisma.pesanan.findUnique({
            where: { id_pesanan },
            include: {
                user: {
                    select: {
                        id_user: true,
                        nama: true,
                        email: true,
                        no_hp: true,
                        alamat: true,
                        role: true,
                        created_at: true,
                        updated_at: true
                    }
                },
                produk: true,
                transaksi: true
            }
        });
    }

    async findByUser(id_user) {
        return prisma.pesanan.findMany({
            where: { id_user },
            orderBy: { tanggal_pesan: "desc" },
            include: { produk: true },
        });
    }

    async updateStatus(id_pesanan, data) {
        return prisma.pesanan.update({
            where: { id_pesanan },
            data,
        });
    }

    // ===============================
    // DASHBOARD CUSTOMER SUMMARY
    // ===============================
    async getSummaryByUser(id_user) {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            where: { id_user },
            _count: { _all: true },
        });
    }

    // ===============================
    // DASHBOARD ADMIN SUMMARY
    // ===============================
    async getSummaryAll() {
        return prisma.pesanan.groupBy({
            by: ["status_pesanan"],
            _count: { _all: true },
        });
    }

    // ===============================
    // TOTAL PESANAN (OPTIONAL)
    // ===============================
    async countByUser(id_user) {
        return prisma.pesanan.count({
            where: { id_user },
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

        return result._sum.jumlah || 0;
    }

}


export default new PesananRepository();
