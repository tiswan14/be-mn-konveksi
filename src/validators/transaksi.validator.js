import { body } from "express-validator";

export const createTransaksiValidator = [
    body("id_pesanan")
        .notEmpty().withMessage("ID pesanan wajib diisi")
        .isInt({ min: 1 }).withMessage("ID pesanan tidak valid"),

    body("jenis_pembayaran")
        .notEmpty().withMessage("Jenis pembayaran wajib diisi")
        .isIn(["DP", "PELUNASAN", "FULL"])
        .withMessage("Jenis pembayaran harus DP, PELUNASAN, atau FULL"),

];
