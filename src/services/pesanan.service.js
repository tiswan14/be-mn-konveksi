import pesananRepo from "../repositories/pesanan.repository.js";

class PesananService {
    async createPesanan({ id_user, id_produk, qty, harga_satuan }) {

        const total_harga = qty * harga_satuan;
        const dp_wajib = Math.floor(total_harga * 0.5); // DP minimal 50%

        return pesananRepo.create({
            id_user,
            id_produk,
            qty,
            harga_satuan,
            total_harga,
            dp_wajib,
        });
    }

    async getPesananUser(id_user) {
        return pesananRepo.findByUser(id_user);
    }

    async getDetailPesanan(id_pesanan) {
        const pesanan = await pesananRepo.findById(id_pesanan);
        if (!pesanan) throw new Error("Pesanan tidak ditemukan");
        return pesanan;
    }

    async updateStatus(id_pesanan, status) {
        return pesananRepo.updateStatus(id_pesanan, status);
    }
}

export default new PesananService();
