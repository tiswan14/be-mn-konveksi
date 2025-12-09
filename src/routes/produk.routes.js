import express from "express";
import multer from "multer";
import { produkController } from "../controllers/produk.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ADMIN ONLY
router.post(
    "/",
    auth(),             // verify token only
    requireAdmin,       // check role ADMIN
    upload.single("foto"),
    produkController.create
);

router.put(
    "/:id",
    auth(),
    requireAdmin,
    upload.single("foto"),
    produkController.update
);

router.delete(
    "/:id",
    auth(),
    requireAdmin,
    produkController.delete
);

// PUBLIC
router.get("/", produkController.getAll);
router.get("/:id", produkController.getById);

export default router;
