/*
  Warnings:

  - You are about to alter the column `Token` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "Token" SET DATA TYPE VARCHAR(50);
