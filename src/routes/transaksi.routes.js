import { Router } from "express";
import transaksiController from "../controllers/transaksi.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createTransaksiValidator } from "../validators/transaksi.validator.js";

const router = Router();

// CREATE PAYMENT (WAJIB LOGIN)
router.post(
    "/create",
    auth(),
    createTransaksiValidator,
    validate,
    transaksiController.createPayment
);

// WEBHOOK (PUBLIC)
router.post(
    "/webhook",
    transaksiController.midtransWebhook
);

export default router;
