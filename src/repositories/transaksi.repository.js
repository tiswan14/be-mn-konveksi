// src/repositories/transaksi.repository.js
import prisma from "../prisma/client.js";

class TransaksiRepository {
    async create(data) {
        return prisma.transaksiPembayaran.create({ data });
    }

    async findByMidtransOrderId(orderId) {
        return prisma.transaksiPembayaran.findUnique({
            where: { midtrans_order_id: orderId },
            include: { pesanan: true },
        });
    }

    async updateStatus(id_transaksi, data) {
        return prisma.transaksiPembayaran.update({
            where: { id_transaksi },
            data,
        });
    }
}

export default new TransaksiRepository();
