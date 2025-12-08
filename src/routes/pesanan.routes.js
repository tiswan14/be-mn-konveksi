import express from "express";
const router = express.Router();

router.get("/", (req, res) => res.send("Pesanan route OK"));

export default router;
