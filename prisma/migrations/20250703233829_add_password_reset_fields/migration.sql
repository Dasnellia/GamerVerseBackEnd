-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "ContrasenaExpira" TIMESTAMP(3),
ADD COLUMN     "ContrasenaTokenReset" VARCHAR(255);
