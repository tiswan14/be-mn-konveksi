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
            include: {
                transaksi: {
                    where: {
                        midtrans_status: "pending",
                    },
                },
            },
        });

        if (!pesanan) {
            throw new Error("Pesanan tidak ditemukan");
        }

        // =======================
        // 🔁 PAKAI ULANG TRANSAKSI PENDING
        // =======================
        const existing = pesanan.transaksi.find(
            (t) => t.jenis_pembayaran === jenis_pembayaran
        );

        if (existing) {
            return {
                order_id: existing.midtrans_order_id,
                snap_token: existing.snap_token,
            };
        }

        let jumlah;

        // =======================
        // VALIDASI & HITUNG JUMLAH
        // =======================
        switch (jenis_pembayaran) {
            case "DP":
                if (pesanan.status_pesanan !== "MENUNGGU_PEMBAYARAN") {
                    throw new Error(
                        "Pesanan belum dalam status menunggu pembayaran"
                    );
                }
                jumlah = pesanan.dp_wajib;
                break;

            case "FULL":
                if (pesanan.status_pesanan !== "MENUNGGU_PEMBAYARAN") {
                    throw new Error(
                        "Pesanan belum dalam status menunggu pembayaran"
                    );
                }
                jumlah = pesanan.total_harga;
                break;

            case "PELUNASAN":
                if (pesanan.dp_status !== "VALID") {
                    throw new Error("DP belum dibayar");
                }
                jumlah = pesanan.total_harga - pesanan.dp_wajib;
                break;

            default:
                throw new Error("Jenis pembayaran tidak valid");
        }

        // =======================
        // MIDTRANS
        // =======================
        const order_id = this.generateOrderId(
            id_pesanan,
            jenis_pembayaran
        );

        const parameter = {
            transaction_details: {
                order_id,
                gross_amount: jumlah,
            },
            customer_details: {
                first_name: `User-${pesanan.id_user}`,
            },
        };

        const snapToken =
            await this.midtrans.createTransactionToken(parameter);

        // =======================
        // SIMPAN TRANSAKSI
        // =======================
        await transaksiRepo.create({
            id_pesanan,
            jenis_pembayaran,
            jumlah,
            midtrans_order_id: order_id,
            snap_token: snapToken,
            midtrans_payment_type: "snap",
            midtrans_status: "pending",
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

        const transaksi =
            await transaksiRepo.findByMidtransOrderId(orderId);
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
                        status_pesanan: "DIPROSES",
                    },
                });
            }

            // PELUNASAN
            else if (transaksi.jenis_pembayaran === "PELUNASAN") {
                await prisma.pesanan.update({
                    where: { id_pesanan: transaksi.id_pesanan },
                    data: {
                        pelunasan_status: "VALID",
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
                        status_pesanan: "DIPROSES",
                    },
                });
            }
        }

        return transaksi;
    }
}

export default new TransaksiService();
