import { Router } from "express";
import transaksiController from "../controllers/transaksi.controller.js";

const router = Router();

// CREATE PAYMENT DP / PELUNASAN
router.post("/create", transaksiController.createPayment);

// WEBHOOK (WAJIB PUBLIC)
router.post("/webhook", transaksiController.midtransWebhook);

export default router;
 