import pesananRepo from "../repositories/pesanan.repository.js";

class PesananService {

    // ===============================
    // GET ALL PESANAN (ADMIN)
    // ===============================
    async getAllPesanan(role) {
        if (role !== "ADMIN") {
            throw new Error("Akses ditolak");
        }

        return pesananRepo.findAll();
    }


    // ===============================
    // CREATE PESANAN
    // ===============================
    async createPesanan({ id_user, id_produk, qty, catatan }) {
        const produk = await pesananRepo.findProdukById(id_produk);
        if (!produk) throw new Error("Produk tidak ditemukan");

        if (qty < 1) throw new Error("Jumlah minimal 1");

        const harga_satuan = produk.harga;
        const total_harga = harga_satuan * qty;
        const dp_wajib = Math.ceil(total_harga * 0.5);

        return pesananRepo.create({
            id_user,
            id_produk,
            qty,
            harga_satuan,
            total_harga,
            dp_wajib,
            catatan: catatan || null,
            status_pesanan: "MENUNGGU_DP"
        });
    }



    // ===============================
    // PESANAN USER
    // ===============================
    async getPesananUser(id_user) {
        return pesananRepo.findByUser(id_user);
    }

    async getDetailPesanan(id_pesanan) {
        const pesanan = await pesananRepo.findById(id_pesanan);
        if (!pesanan) throw new Error("Pesanan tidak ditemukan");
        return pesanan;
    }

    // ===============================
    // UPDATE STATUS (ADMIN)
    // ===============================
    async updateStatus(id_pesanan, status) {
        return pesananRepo.updateStatus(id_pesanan, status);
    }

    // ===============================
    // DELETE PESANAN
    // ===============================

    async deletePesanan({ id_pesanan, id_user, role }) {

        const pesanan = await pesananRepo.findByIdWithTransaksi(id_pesanan);
        if (!pesanan) throw new Error("Pesanan tidak ditemukan");

        if (role === "CUSTOMER" && pesanan.id_user !== id_user) {
            throw new Error("Tidak diizinkan menghapus pesanan ini");
        }

        if (
            pesanan.status_pesanan === "DIPROSES" ||
            pesanan.status_pesanan === "SELESAI"
        ) {
            throw new Error("Pesanan tidak dapat dihapus");
        }

        const sudahDibayar = pesanan.transaksi.some(
            (t) => t.midtrans_status === "settlement"
        );
        if (sudahDibayar) {
            throw new Error("Pesanan dengan pembayaran berhasil tidak dapat dihapus");
        }

        // 🔥 HAPUS TRANSAKSI DULU
        await pesananRepo.deleteTransaksiByPesanan(id_pesanan);

        // 🔥 BARU HAPUS PESANAN
        await pesananRepo.deleteById(id_pesanan);

        return { message: "Pesanan berhasil dihapus" };
    }


    // ===============================
    // DASHBOARD CUSTOMER SUMMARY
    // ===============================
    async getSummaryUser(id_user) {
        const raw = await pesananRepo.getSummaryByUser(id_user);

        const summary = {
            total_pesanan: 0,
            menunggu_dp: 0,
            diproses: 0,
            menunggu_pelunasan: 0,
            selesai: 0,
        };

        raw.forEach(item => {
            summary.total_pesanan += item._count._all;

            if (item.status_pesanan === "MENUNGGU_DP") summary.menunggu_dp = item._count._all;
            if (item.status_pesanan === "DIPROSES") summary.diproses = item._count._all;
            if (item.status_pesanan === "MENUNGGU_PELUNASAN") summary.menunggu_pelunasan = item._count._all;
            if (item.status_pesanan === "SELESAI") summary.selesai = item._count._all;
        });

        return summary;
    }

    // ===============================
    // DASHBOARD ADMIN SUMMARY
    // ===============================
    async getSummaryAdmin() {
        const raw = await pesananRepo.getSummaryAll();
        const totalPendapatan = await pesananRepo.getTotalPendapatan();

        const summary = {
            total_pesanan: 0,
            menunggu_dp: 0,
            diproses: 0,
            menunggu_pelunasan: 0,
            selesai: 0,
            total_pendapatan: totalPendapatan
        };

        raw.forEach(item => {
            summary.total_pesanan += item._count._all;

            if (item.status_pesanan === "MENUNGGU_DP") summary.menunggu_dp = item._count._all;
            if (item.status_pesanan === "DIPROSES") summary.diproses = item._count._all;
            if (item.status_pesanan === "MENUNGGU_PELUNASAN") summary.menunggu_pelunasan = item._count._all;
            if (item.status_pesanan === "SELESAI") summary.selesai = item._count._all;
        });

        return summary;
    }
}

export default new PesananService();
