import pesananRepo from "../repositories/pesanan.repository.js";

class PesananService {

    // ===============================
    // CREATE PESANAN
    // ===============================
    async createPesanan({ id_user, id_produk, qty, catatan }) {

        // ambil produk resmi dari DB
        const produk = await pesananRepo.findProdukById(id_produk);
        if (!produk) {
            throw new Error("Produk tidak ditemukan");
        }

        if (qty < 1) {
            throw new Error("Jumlah minimal 1");
        }

        // 🔒 harga dari DB, BUKAN dari FE
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

    async findProdukById(id_produk) {
        return prisma.produk.findUnique({
            where: { id_produk }
        });
    }


}

export default new PesananService();
