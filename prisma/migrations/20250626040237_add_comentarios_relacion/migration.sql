-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imagen" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'user',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Juego" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "plataformas" TEXT[],
    "categoria" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "descripcionLarga" TEXT NOT NULL,
    "trailerURL" TEXT NOT NULL,
    "galeria" TEXT[],
    "caracteristicas" TEXT[],
    "lanzamiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "juegoId" INTEGER NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nickname_key" ON "Usuario"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
