import prisma from "../prisma/client.js";
import pesananService from "../services/pesanan.service.js";
export const createPesanan = async (req, res) => {
    try {
        const { id_produk, qty, harga_satuan } = req.body;
        const { id, role } = req.user;

        if (role === "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Admin tidak diperbolehkan membuat pesanan",
            });
        }

        const pesanan = await pesananService.createPesanan({
            id_user: id,
            id_produk,
            qty,
            harga_satuan,
        });

        return res.status(201).json({
            success: true,
            message: "Pesanan berhasil dibuat",
            data: pesanan,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


export const getPesananUser = async (req, res) => {
    try {
        const id_user = req.user.id;
        const data = await pesananService.getPesananUser(id_user);

        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getDetailPesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await pesananService.getDetailPesanan(Number(id));

        return res.json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
};

export const updateStatusPesanan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_pesanan } = req.body;

        const data = await pesananService.updateStatus(Number(id), {
            status_pesanan,
        });

        return res.json({
            success: true,
            message: "Status pesanan diperbarui",
            data,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getPesananSummaryUser = async (req, res) => {
    try {
        const data = await pesananService.getSummaryUser(req.user.id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPesananSummaryAdmin = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Akses ditolak" });
        }

        const data = await pesananService.getSummaryAdmin();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
