/*
  Warnings:

  - You are about to drop the column `bukti_transfer` on the `TransaksiPembayaran` table. All the data in the column will be lost.
  - You are about to drop the column `status_verifikasi` on the `TransaksiPembayaran` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[midtrans_order_id]` on the table `TransaksiPembayaran` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `midtrans_order_id` to the `TransaksiPembayaran` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TransaksiPembayaran_status_verifikasi_idx";

-- DropIndex
DROP INDEX "TransaksiPembayaran_tanggal_upload_idx";

-- AlterTable
ALTER TABLE "TransaksiPembayaran" DROP COLUMN "bukti_transfer",
DROP COLUMN "status_verifikasi",
ADD COLUMN     "midtrans_order_id" TEXT NOT NULL,
ADD COLUMN     "midtrans_payment_type" TEXT,
ADD COLUMN     "midtrans_qr_url" TEXT,
ADD COLUMN     "midtrans_redirect_url" TEXT,
ADD COLUMN     "midtrans_settlement_time" TIMESTAMP(3),
ADD COLUMN     "midtrans_status" TEXT,
ADD COLUMN     "midtrans_transaction_id" TEXT,
ADD COLUMN     "midtrans_va_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TransaksiPembayaran_midtrans_order_id_key" ON "TransaksiPembayaran"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_midtrans_order_id_idx" ON "TransaksiPembayaran"("midtrans_order_id");

-- CreateIndex
CREATE INDEX "TransaksiPembayaran_midtrans_status_idx" ON "TransaksiPembayaran"("midtrans_status");
