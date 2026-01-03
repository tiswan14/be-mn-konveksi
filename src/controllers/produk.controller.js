import { produkService } from "../services/produk.service.js";

// ==============================
// CREATE
// ==============================
export const create = async (req, res) => {
    try {
        const produk = await produkService.createProduk(req.body, req.file);

        return res.status(201).json({
            success: true,
            message: "Produk berhasil dibuat",
            data: produk,
        });
    } catch (error) {
        console.error("CREATE PRODUK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal membuat produk",
            error: error.message,
        });
    }

};

// ==============================
// GET ALL
// ==============================
export const getAll = async (req, res) => {
    try {
        const { page, limit, q } = req.query;

        const result = await produkService.getAllProduk({
            page,
            limit,
            q,
        });

        return res.status(200).json({
            success: true,
            message: "Data produk berhasil diambil",
            ...result,
        });
    } catch (error) {
        console.error("GET ALL PRODUK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil data produk",
        });
    }
};


// ==============================
// GET BY ID
// ==============================
export const getById = async (req, res) => {
    try {
        const produk = await produkService.getProdukById(req.params.id);

        if (!produk) {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan",
            });
        }

        return res.status(200).json({
            success: true,
            data: produk,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal mengambil produk",
        });
    }
};

// ==============================
// UPDATE
// ==============================
export const update = async (req, res) => {
    try {
        const produk = await produkService.updateProduk(
            req.params.id,
            req.body,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Produk berhasil diperbarui",
            data: produk,
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Gagal memperbarui produk",
        });
    }
};

// ==============================
// DELETE
// ==============================
export const remove = async (req, res) => {
    try {
        await produkService.deleteProduk(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Produk berhasil dihapus",
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "Produk tidak ditemukan",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Gagal menghapus produk",
        });
    }
};
