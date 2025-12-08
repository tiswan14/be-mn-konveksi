-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('BELUM', 'MENUNGGU_VERIFIKASI', 'VALID', 'INVALID');

-- CreateEnum
CREATE TYPE "StatusPesanan" AS ENUM ('MENUNGGU_DP', 'DIPROSES', 'MENUNGGU_PELUNASAN', 'SELESAI');

-- CreateEnum
CREATE TYPE "JenisPembayaran" AS ENUM ('DP', 'PELUNASAN');

-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "alamat" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Produk" (
    "id_produk" SERIAL NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "foto" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id_produk")
);

-- CreateTable
CREATE TABLE "Pesanan" (
    "id_pesanan" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_produk" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_satuan" INTEGER NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "dp_wajib" INTEGER NOT NULL,
    "dp_status" "StatusPembayaran" NOT NULL DEFAULT 'BELUM',
    "pelunasan_status" "StatusPembayaran" NOT NULL DEFAULT 'BELUM',
    "status_pesanan" "StatusPesanan" NOT NULL DEFAULT 'MENUNGGU_DP',
    "tanggal_pesan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("id_pesanan")
);

-- CreateTable
CREATE TABLE "TransaksiPembayaran" (
    "id_transaksi" SERIAL NOT NULL,
    "id_pesanan" INTEGER NOT NULL,
    "jenis_pembayaran" "JenisPembayaran" NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "bukti_transfer" TEXT NOT NULL,
    "status_verifikasi" "StatusPembayaran" NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    "tanggal_upload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransaksiPembayaran_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Pesanan" ADD CONSTRAINT "Pesanan_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pesanan" ADD CONSTRAINT "Pesanan_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "Produk"("id_produk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiPembayaran" ADD CONSTRAINT "TransaksiPembayaran_id_pesanan_fkey" FOREIGN KEY ("id_pesanan") REFERENCES "Pesanan"("id_pesanan") ON DELETE RESTRICT ON UPDATE CASCADE;
