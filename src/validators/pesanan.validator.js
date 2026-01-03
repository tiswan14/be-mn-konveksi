import { body, param } from "express-validator";

export const createPesananValidator = [
    body("id_produk")
        .notEmpty().withMessage("ID produk wajib diisi")
        .isInt({ min: 1 }).withMessage("ID produk tidak valid"),

    body("qty")
        .notEmpty().withMessage("Qty wajib diisi")
        .isInt({ min: 1 }).withMessage("Qty minimal 1"),

    body("harga_satuan")
        .notEmpty().withMessage("Harga satuan wajib diisi")
        .isInt({ min: 1 }).withMessage("Harga satuan tidak valid"),
];

export const updateStatusPesananValidator = [
    param("id")
        .isInt().withMessage("ID pesanan tidak valid"),

    body("status_pesanan")
        .notEmpty().withMessage("Status wajib diisi")
        .isIn([
            "MENUNGGU_DP",
            "DIPROSES",
            "MENUNGGU_PELUNASAN",
            "SELESAI"
        ])
        .withMessage("Status pesanan tidak valid"),
];
