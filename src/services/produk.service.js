import { produkRepository } from "../repositories/produk.repository.js";
import { put, del } from "@vercel/blob";

export const produkService = {
    // ======================================================
    // CREATE PRODUK
    // ======================================================
    createProduk: async (data, file) => {
        let fotoUrl = null;

        if (file) {
            const upload = await put(
                `produk/${Date.now()}-${file.originalname}`,
                file.buffer,
                { access: "public" }
            );

            fotoUrl = upload.url;
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

    // ======================================================
    // GET ALL PRODUK (PAGINATION + SEARCH)
    // ======================================================
    getAllProduk: async ({ page = 1, limit = 10, q }) => {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const [data, total] = await Promise.all([
            produkRepository.findAll({ skip, take, q }),
            produkRepository.count(q),
        ]);

        return {
            data,
            pagination: {
                page: Number(page),
                limit: take,
                total_data: total,
                total_page: Math.ceil(total / take),
            },
        };
    },

    // ======================================================
    // GET PRODUK BY ID
    // ======================================================
    getProdukById: async (id) => {
        return produkRepository.findById(id);
    },

    // ======================================================
    // UPDATE PRODUK + HAPUS FOTO LAMA
    // ======================================================
    updateProduk: async (id, data, file) => {
        const id_produk = Number(id);
        if (isNaN(id_produk)) {
            throw new Error("ID produk tidak valid");
        }

        // ambil produk lama
        const existingProduk = await produkRepository.findById(id_produk);
        if (!existingProduk) {
            const err = new Error("Produk tidak ditemukan");
            err.code = "P2025";
            throw err;
        }

        let fotoUrl = existingProduk.foto;

        // upload foto baru (opsional)
        if (file) {
            const upload = await put(
                `produk/${Date.now()}-${file.originalname}`,
                file.buffer,
                { access: "public" }
            );

            fotoUrl = upload.url;

            if (existingProduk.foto) {
                try {
                    await del(existingProduk.foto);
                } catch (err) {
                    console.warn("Gagal hapus foto lama:", err.message);
                }
            }
        }

        // 🔥 FILTER DATA (ANTI undefined & NaN)
        const payload = {};

        if (data.nama_produk !== undefined) payload.nama_produk = data.nama_produk;
        if (data.deskripsi !== undefined) payload.deskripsi = data.deskripsi;
        if (data.harga !== undefined) payload.harga = Number(data.harga);
        if (data.estimasi_pengerjaan !== undefined)
            payload.estimasi_pengerjaan = Number(data.estimasi_pengerjaan);
        if (data.bahan !== undefined) payload.bahan = data.bahan;
        if (fotoUrl !== undefined) payload.foto = fotoUrl;

        if (Object.keys(payload).length === 0) {
            throw new Error("Tidak ada data yang diupdate");
        }

        return produkRepository.update(id_produk, payload);
    },


    // ======================================================
    // DELETE PRODUK + HAPUS FOTO
    // ======================================================
    deleteProduk: async (id) => {
        const produk = await produkRepository.findById(id);

        if (!produk) {
            const err = new Error("Produk tidak ditemukan");
            err.code = "P2025";
            throw err;
        }

        if (produk.foto) {
            try {
                await del(produk.foto);
            } catch (err) {
                console.warn("Gagal hapus foto:", err.message);
            }
        }

        return produkRepository.delete(id);
    },
};
