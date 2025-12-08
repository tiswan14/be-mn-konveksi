import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Produk route berjalan");
});

export default router;
