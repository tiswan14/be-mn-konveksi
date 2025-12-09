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
}

export default new PesananRepository();
