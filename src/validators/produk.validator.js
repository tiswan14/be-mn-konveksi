import { body, param } from "express-validator";
import { produkRepository } from "../repositories/produk.repository.js";


// ==============================
// CREATE & UPDATE PRODUK
// ==============================
export const produkValidator = [
    body("nama_produk")
        .notEmpty().withMessage("Nama produk wajib diisi")
        .isLength({ min: 3 }).withMessage("Nama produk minimal 3 karakter")
        .custom(async (value, { req }) => {
            // cek apakah nama produk sudah ada
            const existingProduk = await produkRepository.findByNama(value);

            // KASUS CREATE
            if (existingProduk && !req.params.id) {
                throw new Error("Nama produk sudah digunakan");
            }

            // KASUS UPDATE (boleh sama dengan dirinya sendiri)
            if (
                existingProduk &&
                req.params.id &&
                existingProduk.id_produk !== Number(req.params.id)
            ) {
                throw new Error("Nama produk sudah digunakan");
            }

            return true;
        }),

    body("deskripsi")
        .notEmpty().withMessage("Deskripsi wajib diisi"),

    body("harga")
        .notEmpty().withMessage("Harga wajib diisi")
        .isInt({ min: 1 }).withMessage("Harga harus berupa angka"),

    body("estimasi_pengerjaan")
        .notEmpty().withMessage("Estimasi pengerjaan wajib diisi")
        .isInt({ min: 1 }).withMessage("Estimasi pengerjaan harus angka"),

    body("bahan")
        .notEmpty().withMessage("Bahan wajib diisi"),
];

// ==============================
// PARAM ID
// ==============================
export const produkIdParam = [
    param("id")
        .isInt().withMessage("ID produk tidak valid"),
];
