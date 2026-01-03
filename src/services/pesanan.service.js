import pesananRepo from "../repositories/pesanan.repository.js";

class PesananService {

    // ===============================
    // CREATE PESANAN
    // ===============================
    async createPesanan({ id_user, id_produk, qty, harga_satuan }) {

        const produk = await pesananRepo.findProdukById(id_produk);
        if (!produk) throw new Error("Produk tidak ditemukan");

        const total_harga = qty * harga_satuan;
        const dp_wajib = Math.floor(total_harga * 0.5);

        return pesananRepo.create({
            id_user,
            id_produk,
            qty,
            harga_satuan,
            total_harga,
            dp_wajib,
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

            if (item.status_pesanan === "MENUNGGU_DP") {
                summary.menunggu_dp = item._count._all;
            }
            if (item.status_pesanan === "DIPROSES") {
                summary.diproses = item._count._all;
            }
            if (item.status_pesanan === "MENUNGGU_PELUNASAN") {
                summary.menunggu_pelunasan = item._count._all;
            }
            if (item.status_pesanan === "SELESAI") {
                summary.selesai = item._count._all;
            }
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
