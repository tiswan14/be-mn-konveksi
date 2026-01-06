/*
  Warnings:

  - Added the required column `snap_token` to the `TransaksiPembayaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransaksiPembayaran" ADD COLUMN     "snap_token" TEXT NOT NULL;
