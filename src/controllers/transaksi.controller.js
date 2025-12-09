import transaksiService from "../services/transaksi.service.js";

class TransaksiController {
    async createPayment(req, res) {
        try {
            const { id_pesanan, jenis_pembayaran } = req.body;

            const snap = await transaksiService.createPayment(
                id_pesanan,
                jenis_pembayaran
            );

            return res.json({
                success: true,
                message: "Transaksi berhasil dibuat",
                data: snap,
            });

        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async midtransWebhook(req, res) {
        try {
            await transaksiService.webhook(req.body);
            res.status(200).json({ message: "Webhook processed" });
        } catch (error) {
            console.error("Webhook Error:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default new TransaksiController();
