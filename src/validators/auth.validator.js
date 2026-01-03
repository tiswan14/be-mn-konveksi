import { body } from "express-validator";

// ==============================
// REGISTER VALIDATOR
// ==============================
export const registerValidator = [
    body("nama")
        .notEmpty().withMessage("Nama wajib diisi")
        .isLength({ min: 3 }).withMessage("Nama minimal 3 karakter"),

    body("email")
        .notEmpty().withMessage("Email wajib diisi")
        .isEmail().withMessage("Format email tidak valid")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password wajib diisi")
        .isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),

    body("no_hp")
        .notEmpty().withMessage("No HP wajib diisi")
        .isNumeric().withMessage("No HP harus angka")
        .isLength({ min: 10, max: 15 }).withMessage("No HP tidak valid"),

    body("alamat")
        .optional()
        .isString().withMessage("Alamat harus berupa teks"),
];

// ==============================
// LOGIN VALIDATOR
// ==============================
export const loginValidator = [
    body("email")
        .notEmpty().withMessage("Email wajib diisi")
        .isEmail().withMessage("Format email tidak valid")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password wajib diisi"),
];
