# 🎮 GamerVerseBackEnd

_Back-end del ecosistema GamerVerse: una plataforma para descubrir, comprar y calificar videojuegos._

## 🚀 Descripción

GamerVerseBackEnd es una API robusta construida en Node.js y Prisma para gestionar información de juegos, usuarios, ventas, calificaciones, noticias y plataformas. Este backend facilita la conexión con la base de datos PostgreSQL y permite una administración eficiente de todos los recursos del proyecto GamerVerse.

---

## 📦 Requisitos Previos

- Node.js >= 18
- PostgreSQL en ejecución (por defecto en puerto `5432`)

---

## ⚙️ Configuración Inicial

1. Clona el repositorio
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura el archivo `.env`:

   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_basedatos"
   ```

4. Genera la migración inicial y aplica los cambios:

   ```bash
   npx prisma migrate dev --name init
   en name pones el nombre de la migracion, pon lo q quieras
     ```

5. (Opcional en producción):

   ```bash
   npx prisma migrate deploy
   ```

6. Abre Prisma Studio para ver tu base de datos de forma gráfica:

   ```bash
   npx prisma studio
   ```

---

## 🧱 Estructura del Proyecto

```
/prisma
  ├── schema.prisma
  └── migrations/
/src
  ├── controllers/
  ├── models/
  ├── routes/
  └── index.js
```

---
