/*
  Warnings:

  - The values [MENUNGGU_VERIFIKASI] on the enum `StatusPesanan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusPesanan_new" AS ENUM ('DIBUAT', 'MENUNGGU_DP', 'DIPROSES', 'MENUNGGU_PELUNASAN', 'SELESAI', 'DIBATALKAN');
ALTER TABLE "Pesanan" ALTER COLUMN "status_pesanan" DROP DEFAULT;
ALTER TABLE "Pesanan" ALTER COLUMN "status_pesanan" TYPE "StatusPesanan_new" USING ("status_pesanan"::text::"StatusPesanan_new");
ALTER TYPE "StatusPesanan" RENAME TO "StatusPesanan_old";
ALTER TYPE "StatusPesanan_new" RENAME TO "StatusPesanan";
DROP TYPE "StatusPesanan_old";
ALTER TABLE "Pesanan" ALTER COLUMN "status_pesanan" SET DEFAULT 'MENUNGGU_DP';
COMMIT;
