import { produkService } from "../services/produk.service.js";

export const produkController = {
    create: async (req, res) => {
        try {
            const produk = await produkService.createProduk(req.body, req.file);

            return res.status(201).json({
                success: true,
                message: "Produk berhasil dibuat",
                data: produk,
            });
        } catch (error) {
            console.error("Create Produk Error:", error);
            return res.status(500).json({
                success: false,
                message: "Gagal membuat produk",
                error: error.message,
            });
        }
    },

    getAll: async (req, res) => {
        try {
            const produk = await produkService.getAllProduk();
            return res.status(200).json({
                success: true,
                message: "Data produk berhasil diambil",
                data: produk,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data produk",
                error: error.message,
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const produk = await produkService.getProdukById(id);

            if (!produk) {
                return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
            }

            return res.status(200).json({
                success: true,
                message: "Detail produk berhasil diambil",
                data: produk,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil produk",
                error: error.message,
            });
        }
    },

    update: async (req, res) => {
        try {
            const produk = await produkService.updateProduk(req.params.id, req.body, req.file);

            return res.status(200).json({
                success: true,
                message: "Produk berhasil diperbarui",
                data: produk,
            });

        } catch (error) {

            // Prisma: record not found error (P2025)
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan",
                });
            }

            return res.status(500).json({
                success: false,
                message: "Gagal memperbarui produk",
                error: error.message,
            });
        }
    },


    delete: async (req, res) => {
        try {
            await produkService.deleteProduk(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Produk berhasil dihapus",
            });
        } catch (error) {

            // Prisma: Record not found (P2025)
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Produk tidak ditemukan",
                });
            }

            // Error lain = 500
            return res.status(500).json({
                success: false,
                message: "Gagal menghapus produk",
                error: error.message,
            });
        }
    }

};
