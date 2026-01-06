import express from "express";
import multer from "multer";

import * as produkController from "../controllers/produk.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.js";

import {
    produkValidatorCreate,
    produkValidatorUpdate,
    produkIdParam,
} from "../validators/produk.validator.js";

import { validateImageUpload } from "../validators/uploadImage.validator.js";

const router = express.Router();

// ==============================
// MULTER CONFIG (5 MB)
// ==============================
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// ==============================
// ADMIN ONLY
// ==============================
router.post(
    "/",
    auth(),
    requireAdmin,
    upload.single("foto"),
    validateImageUpload,
    produkValidatorCreate,
    validate,
    produkController.create
);

router.patch(
    "/:id",
    auth(),
    requireAdmin,
    upload.single("foto"),
    validateImageUpload,
    produkIdParam,
    produkValidatorUpdate,
    validate,
    produkController.update
);


router.delete(
    "/:id",
    auth(),
    requireAdmin,
    produkIdParam,
    validate,
    produkController.remove
);

// ==============================
// PUBLIC
// ==============================
router.get("/", produkController.getAll);

router.get(
    "/:id",
    produkIdParam,
    validate,
    produkController.getById
);

export default router;
