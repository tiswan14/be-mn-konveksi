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

    // =======================
    // GENERATE ORDER ID
    // =======================
    generateOrderId(id_pesanan, jenis) {
        return `PESANAN-${id_pesanan}-${jenis}-${Date.now()}`;
    }

    // =======================
    // CREATE PAYMENT (DP / PELUNASAN / FULL)
    // =======================
    async createPayment(id_pesanan, jenis_pembayaran) {
        const pesanan = await prisma.pesanan.findUnique({
            where: { id_pesanan },
        });

        if (!pesanan) throw new Error("Pesanan tidak ditemukan");

        let jumlah = 0;

        // =======================
        // VALIDASI & HITUNG JUMLAH
        // =======================
        if (jenis_pembayaran === "DP") {
            if (pesanan.status_pesanan !== "MENUNGGU_DP") {
                throw new Error("Pesanan tidak dalam status menunggu DP");
            }
            jumlah = pesanan.dp_wajib;
        }

        else if (jenis_pembayaran === "PELUNASAN") {
            if (pesanan.status_pesanan !== "MENUNGGU_PELUNASAN") {
                throw new Error("Pesanan belum bisa dilakukan pelunasan");
            }
            jumlah = pesanan.total_harga - pesanan.dp_wajib;
        }

        else if (jenis_pembayaran === "FULL") {
            if (pesanan.status_pesanan !== "MENUNGGU_DP") {
                throw new Error("Pesanan tidak bisa dibayar full");
            }
            jumlah = pesanan.total_harga;
        }

        else {
            throw new Error("Jenis pembayaran tidak valid");
        }

        // =======================
        // MIDTRANS
        // =======================
        const order_id = this.generateOrderId(id_pesanan, jenis_pembayaran);

        const parameter = {
            transaction_details: {
                order_id,
                gross_amount: jumlah,
            },
            customer_details: {
                first_name: `User-${pesanan.id_user}`,
            },
        };

        const snapToken = await this.midtrans.createTransactionToken(parameter);

        // =======================
        // SIMPAN TRANSAKSI
        // =======================
        await transaksiRepo.create({
            id_pesanan,
            jenis_pembayaran,
            jumlah,
            midtrans_order_id: order_id,
            midtrans_payment_type: "snap",
            midtrans_status: "pending",
        });

        // =======================
        // UPDATE STATUS PESANAN
        // =======================
        await prisma.pesanan.update({
            where: { id_pesanan },
            data: {
                status_pesanan: "MENUNGGU_VERIFIKASI",
            },
        });

        return {
            order_id,
            snap_token: snapToken,
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

        // =======================
        // UPDATE PESANAN
        // =======================
        if (status === "settlement") {

            // DP
            if (transaksi.jenis_pembayaran === "DP") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        dp_status: "VALID",
                        status_pesanan: "MENUNGGU_PELUNASAN",
                    },
                });
            }

            // PELUNASAN
            else if (transaksi.jenis_pembayaran === "PELUNASAN") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        pelunasan_status: "VALID",
                        status_pesanan: "SELESAI",
                    },
                });
            }

            // FULL
            else if (transaksi.jenis_pembayaran === "FULL") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        dp_status: "VALID",
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
