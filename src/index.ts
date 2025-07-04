// backend/src/index.ts (después de la modificación)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
// import jwt from 'jsonwebtoken'; // <--- ¡Eliminar esta línea!

// ... (otras importaciones de rutas)
import usuarioRoutes from './routes/usuarioRoutes';
// ...

dotenv.config();
const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ====================================================================
// ¡ELIMINA TODO EL BLOQUE DEL MIDDLEWARE JWT QUE ESTABA AQUÍ!
// No debe haber NINGÚN app.use global para JWT en este archivo.
// ====================================================================

// Rutas de la API (monta tus routers normalmente)
app.use('/api/usuarios', usuarioRoutes);
// ... (otras rutas como juegos, carrito, etc.)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// ... (PrismaClient y manejo de cierre)