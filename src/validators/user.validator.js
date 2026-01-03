// src/validators/user.validator.js
import { body, param } from "express-validator";

export const userIdParamValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("ID user tidak valid"),
];

export const updateUserValidator = [
    body("nama")
        .optional()
        .isString()
        .isLength({ min: 3 })
        .withMessage("Nama minimal 3 karakter"),

    body("no_hp")
        .optional()
        .isNumeric()
        .isLength({ min: 10, max: 15 })
        .withMessage("No HP tidak valid"),

    body("alamat")
        .optional()
        .isString()
        .withMessage("Alamat harus berupa teks"),

    body("role")
        .optional()
        .isIn(["ADMIN", "CUSTOMER"])
        .withMessage("Role tidak valid"),
];
