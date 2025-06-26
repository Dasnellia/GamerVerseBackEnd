/*
  Warnings:

  - You are about to drop the column `name` on the `Usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "name",
ADD COLUMN     "pais" TEXT;
