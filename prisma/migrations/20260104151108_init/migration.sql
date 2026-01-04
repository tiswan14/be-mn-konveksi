-- DropIndex
DROP INDEX "Pesanan_dp_status_idx";

-- DropIndex
DROP INDEX "Pesanan_pelunasan_status_idx";

-- DropIndex
DROP INDEX "Pesanan_tanggal_pesan_idx";

-- AlterTable
ALTER TABLE "Pesanan" ADD COLUMN     "catatan" TEXT;
