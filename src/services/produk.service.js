import { produkRepository } from "../repositories/produk.repository.js";
import { put } from "@vercel/blob";

export const produkService = {
    createProduk: async (data, file) => {
        let fotoUrl = null;

        if (file) {
            // Upload ke Vercel Blob
            const upload = await put(`produk/${Date.now()}-${file.originalname}`, file.buffer, {
                access: "public",
            });

            fotoUrl = upload.url; // URL dari vercel blob
        }

        return produkRepository.create({
            nama_produk: data.nama_produk,
            deskripsi: data.deskripsi,
            harga: Number(data.harga),
            estimasi_pengerjaan: Number(data.estimasi_pengerjaan),
            bahan: data.bahan,
            foto: fotoUrl,
        });
    },

    getAllProduk: () => produkRepository.findAll(),

    getProdukById: (id) => produkRepository.findById(id),

    updateProduk: async (id, data, file) => {
        let fotoUrl = undefined;

        if (file) {
            const upload = await put(`produk/${Date.now()}-${file.originalname}`, file.buffer, {
                access: "public",
            });

            fotoUrl = upload.url;
        }

        return produkRepository.update(id, {
            nama_produk: data.nama_produk,
            deskripsi: data.deskripsi,
            harga: Number(data.harga),
            estimasi_pengerjaan: Number(data.estimasi_pengerjaan),
            bahan: data.bahan,
            ...(fotoUrl && { foto: fotoUrl }),
        });
    },

    deleteProduk: (id) => produkRepository.delete(id),
};
