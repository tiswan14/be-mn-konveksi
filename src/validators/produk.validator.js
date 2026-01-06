import { body, param } from "express-validator";
import { produkRepository } from "../repositories/produk.repository.js";

// ==============================
// CREATE PRODUK (SEMUA WAJIB)
// ==============================
export const produkValidatorCreate = [
    body("nama_produk")
        .notEmpty().withMessage("Nama produk wajib diisi")
        .isLength({ min: 3 }).withMessage("Nama produk minimal 3 karakter")
        .custom(async (value) => {
            const existingProduk = await produkRepository.findByNama(value);
            if (existingProduk) {
                throw new Error("Nama produk sudah digunakan");
            }
            return true;
        }),

    body("deskripsi").notEmpty().withMessage("Deskripsi wajib diisi"),

    body("harga")
        .notEmpty().withMessage("Harga wajib diisi")
        .isInt({ min: 1 }).withMessage("Harga harus berupa angka"),

    body("estimasi_pengerjaan")
        .notEmpty().withMessage("Estimasi pengerjaan wajib diisi")
        .isInt({ min: 1 }).withMessage("Estimasi pengerjaan harus angka"),

    body("bahan").notEmpty().withMessage("Bahan wajib diisi"),
];

// ==============================
// UPDATE PRODUK (OPTIONAL)
// ==============================
export const produkValidatorUpdate = [
    body("nama_produk")
        .optional()
        .isLength({ min: 3 }).withMessage("Nama produk minimal 3 karakter")
        .custom(async (value, { req }) => {
            const existingProduk = await produkRepository.findByNama(value);
            if (
                existingProduk &&
                existingProduk.id_produk !== Number(req.params.id)
            ) {
                throw new Error("Nama produk sudah digunakan");
            }
            return true;
        }),

    body("deskripsi").optional().notEmpty(),
    body("harga").optional().isInt({ min: 1 }),
    body("estimasi_pengerjaan").optional().isInt({ min: 1 }),
    body("bahan").optional().notEmpty(),
];

// ==============================
// PARAM ID
// ==============================
export const produkIdParam = [
    param("id").isInt().withMessage("ID produk tidak valid"),
];
