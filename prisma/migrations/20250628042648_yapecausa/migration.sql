/*
  Warnings:

  - The primary key for the `Calificacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Juego_CategoriaID` on the `Calificacion` table. All the data in the column will be lost.
  - The primary key for the `Juego_Plataforma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Juego_Categoria_CategoriaID` on the `Juego_Plataforma` table. All the data in the column will be lost.
  - You are about to drop the column `Juego_JuegoID` on the `Juego_Plataforma` table. All the data in the column will be lost.
  - You are about to drop the column `Plataforma_PlataformaID` on the `Juego_Plataforma` table. All the data in the column will be lost.
  - You are about to drop the column `Estado` on the `Usuario` table. All the data in the column will be lost.
  - The primary key for the `Venta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[Correo]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Descripcion` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DescripcionLarga` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Imagen` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Lanzamiento` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Rating` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Stock` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TrailerURL` to the `Juego` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `Precio` on the `Juego` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Estado` on the `Juego` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `JuegoID` to the `Juego_Plataforma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PlataformaID` to the `Juego_Plataforma` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `MontoPagado` on the `Venta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Juego_Plataforma" DROP CONSTRAINT "Juego_Plataforma_Juego_JuegoID_fkey";

-- DropForeignKey
ALTER TABLE "Juego_Plataforma" DROP CONSTRAINT "Juego_Plataforma_Plataforma_PlataformaID_fkey";

-- DropIndex
DROP INDEX "Calificacion_Usuario_UsuarioID_key";

-- DropIndex
DROP INDEX "Usuario_UsuarioID_key";

-- AlterTable
CREATE SEQUENCE calificacion_calificacionid_seq;
ALTER TABLE "Calificacion" DROP CONSTRAINT "Calificacion_pkey",
DROP COLUMN "Juego_CategoriaID",
ALTER COLUMN "CalificacionID" SET DEFAULT nextval('calificacion_calificacionid_seq'),
ADD CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("CalificacionID");
ALTER SEQUENCE calificacion_calificacionid_seq OWNED BY "Calificacion"."CalificacionID";

-- AlterTable
ALTER TABLE "Juego" ADD COLUMN     "Caracteristicas" TEXT[],
ADD COLUMN     "Descripcion" TEXT NOT NULL,
ADD COLUMN     "DescripcionLarga" TEXT NOT NULL,
ADD COLUMN     "Descuento" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "Galeria" TEXT[],
ADD COLUMN     "Imagen" TEXT NOT NULL,
ADD COLUMN     "Lanzamiento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Stock" INTEGER NOT NULL,
ADD COLUMN     "TrailerURL" TEXT NOT NULL,
DROP COLUMN "Precio",
ADD COLUMN     "Precio" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "Oferta" SET DEFAULT 0,
DROP COLUMN "Estado",
ADD COLUMN     "Estado" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Juego_Plataforma" DROP CONSTRAINT "Juego_Plataforma_pkey",
DROP COLUMN "Juego_Categoria_CategoriaID",
DROP COLUMN "Juego_JuegoID",
DROP COLUMN "Plataforma_PlataformaID",
ADD COLUMN     "JuegoID" INTEGER NOT NULL,
ADD COLUMN     "PlataformaID" INTEGER NOT NULL,
ADD CONSTRAINT "Juego_Plataforma_pkey" PRIMARY KEY ("PlataformaID", "JuegoID");

-- AlterTable
CREATE SEQUENCE noticia_noticiaid_seq;
ALTER TABLE "Noticia" ALTER COLUMN "NoticiaID" SET DEFAULT nextval('noticia_noticiaid_seq');
ALTER SEQUENCE noticia_noticiaid_seq OWNED BY "Noticia"."NoticiaID";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "Estado",
ADD COLUMN     "Admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Pais" VARCHAR(50),
ADD COLUMN     "Verificado" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "Token" DROP NOT NULL;

-- AlterTable
CREATE SEQUENCE venta_ventaid_seq;
ALTER TABLE "Venta" DROP CONSTRAINT "Venta_pkey",
ALTER COLUMN "VentaID" SET DEFAULT nextval('venta_ventaid_seq'),
DROP COLUMN "MontoPagado",
ADD COLUMN     "MontoPagado" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Venta_pkey" PRIMARY KEY ("VentaID");
ALTER SEQUENCE venta_ventaid_seq OWNED BY "Venta"."VentaID";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Correo_key" ON "Usuario"("Correo");

-- AddForeignKey
ALTER TABLE "Juego_Plataforma" ADD CONSTRAINT "Juego_Plataforma_PlataformaID_fkey" FOREIGN KEY ("PlataformaID") REFERENCES "Plataforma"("PlataformaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Juego_Plataforma" ADD CONSTRAINT "Juego_Plataforma_JuegoID_fkey" FOREIGN KEY ("JuegoID") REFERENCES "Juego"("JuegoID") ON DELETE RESTRICT ON UPDATE CASCADE;
