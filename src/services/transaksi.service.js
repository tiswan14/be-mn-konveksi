import midtransClient from "midtrans-client";
import transaksiRepo from "../repositories/transaksi.repository.js";
import prisma from "../prisma/client.js";

class TransaksiService {
    constructor() {
        this.midtrans = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });
    }

    // Generate Order ID
    generateOrderId(id_pesanan, jenis) {
        return `PESANAN-${id_pesanan}-${jenis}-${Date.now()}`;
    }

    // =======================
    // CREATE PAYMENT (DP / PELUNASAN)
    // =======================
    async createPayment(id_pesanan, jenis_pembayaran) {
        const pesanan = await prisma.pesanan.findUnique({
            where: { id_pesanan },
        });

        if (!pesanan) throw new Error("Pesanan tidak ditemukan.");

        const jumlah =
            jenis_pembayaran === "DP"
                ? pesanan.dp_wajib
                : pesanan.total_harga - pesanan.dp_wajib;

        const order_id = this.generateOrderId(id_pesanan, jenis_pembayaran);

        // Midtrans Payload
        const parameter = {
            transaction_details: {
                order_id,
                gross_amount: jumlah,
            },
            customer_details: {
                first_name: pesanan.id_user,
            },
        };

        const snap = await this.midtrans.createTransaction(parameter);

        // SIMPAN TRANSAKSI
        await transaksiRepo.create({
            id_pesanan,
            jenis_pembayaran,
            jumlah,
            midtrans_order_id: order_id,
            midtrans_redirect_url: snap.redirect_url,
            midtrans_payment_type: "snap",
            midtrans_status: "pending",
        });

        return {
            order_id,
            token: snap.token,
            redirect_url: snap.redirect_url
        };

    }

    // =======================
    // HANDLE WEBHOOK MIDTRANS
    // =======================
    async webhook(data) {
        const orderId = data.order_id;
        const status = data.transaction_status;
        const paymentType = data.payment_type;

        const transaksi = await transaksiRepo.findByMidtransOrderId(orderId);
        if (!transaksi) return;

        // UPDATE TRANSAKSI
        await transaksiRepo.updateStatus(transaksi.id_transaksi, {
            midtrans_status: status,
            midtrans_payment_type: paymentType,
            midtrans_settlement_time:
                status === "settlement" ? new Date() : null,
        });

        // UPDATE PESANAN
        if (status === "settlement") {
            if (transaksi.jenis_pembayaran === "DP") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        dp_status: "VALID",
                        status_pesanan: "DIPROSES",
                    },
                });
            } else if (transaksi.jenis_pembayaran === "PELUNASAN") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        pelunasan_status: "VALID",
                        status_pesanan: "SELESAI",
                    },
                });
            }
        }

        return transaksi;
    }
}

export default new TransaksiService();
