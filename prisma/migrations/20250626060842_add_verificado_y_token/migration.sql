/*
  Warnings:

  - You are about to drop the column `creadoEn` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "creadoEn",
ADD COLUMN     "token" TEXT,
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT false;
