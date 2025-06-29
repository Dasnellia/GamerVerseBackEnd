/*
  Warnings:

  - Changed the type of `Valoracion` on the `Calificacion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Calificacion" DROP COLUMN "Valoracion",
ADD COLUMN     "Valoracion" INTEGER NOT NULL;
