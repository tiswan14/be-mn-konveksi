-- DropIndex
DROP INDEX "Pesanan_id_produk_idx";

-- DropIndex
DROP INDEX "Pesanan_id_user_idx";

-- AlterTable
ALTER TABLE "Pesanan" ADD COLUMN     "estimasi_hari" INTEGER NOT NULL DEFAULT 0;
