/*
  Warnings:

  - You are about to alter the column `Imagen` on the `Juego` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `TrailerURL` on the `Juego` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `Activo` on the `Noticia` table. All the data in the column will be lost.
  - You are about to drop the column `Texto` on the `Noticia` table. All the data in the column will be lost.
  - Added the required column `Descripcion` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Foto` to the `Noticia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Juego" ALTER COLUMN "Imagen" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "TrailerURL" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "Activo",
DROP COLUMN "Texto",
ADD COLUMN     "Descripcion" VARCHAR(1000) NOT NULL,
ADD COLUMN     "Foto" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "Foto" VARCHAR(255);

-- CreateTable
CREATE TABLE "CarritoItem" (
    "CarritoItemID" SERIAL NOT NULL,
    "UsuarioID" INTEGER NOT NULL,
    "JuegoID" INTEGER NOT NULL,
    "Cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CarritoItem_pkey" PRIMARY KEY ("CarritoItemID")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_UsuarioID_JuegoID_key" ON "CarritoItem"("UsuarioID", "JuegoID");

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_UsuarioID_fkey" FOREIGN KEY ("UsuarioID") REFERENCES "Usuario"("UsuarioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_JuegoID_fkey" FOREIGN KEY ("JuegoID") REFERENCES "Juego"("JuegoID") ON DELETE RESTRICT ON UPDATE CASCADE;
