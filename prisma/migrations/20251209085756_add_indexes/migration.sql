-- CreateIndex
CREATE INDEX "Pesanan_id_user_idx" ON "Pesanan"("id_user");

-- CreateIndex
CREATE INDEX "Pesanan_id_produk_idx" ON "Pesanan"("id_produk");

-- CreateIndex
CREATE INDEX "Pesanan_status_pesanan_idx" ON "Pesanan"("status_pesanan");

-- CreateIndex
CREATE INDEX "Pesanan_dp_status_idx" ON "Pesanan"("dp_status");

-- CreateIndex
CREATE INDEX "Pesanan_pelunasan_status_idx" ON "Pesanan"("pelunasan_status");

-- CreateIndex
CREATE INDEX "Pesanan_tanggal_pesan_idx" ON "Pesanan"("tanggal_pesan");

-- CreateIndex
CREATE INDEX "Produk_nama_produk_idx" ON "Produk"("nama_produk");

-- CreateIndex
CREATE INDEX "Produk_harga_idx" ON "Produk"("harga");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_id_pesanan_idx" ON "TransaksiPembayaran"("id_pesanan");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_jenis_pembayaran_idx" ON "TransaksiPembayaran"("jenis_pembayaran");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_status_verifikasi_idx" ON "TransaksiPembayaran"("status_verifikasi");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_tanggal_upload_idx" ON "TransaksiPembayaran"("tanggal_upload");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");
