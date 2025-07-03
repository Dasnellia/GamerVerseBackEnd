import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken'; 

// Importaciones de rutas
import usuarioRoutes from './routes/usuarioRoutes';
import juegoRoutes from './routes/juegoRoutes';
import carritoRoutes from './routes/carritoRoutes';
import noticiaRoutes from './routes/noticiaRoutes';
import listausersRoutes from './routes/listauserRoutes';

import { PrismaClient } from './generated/prisma'; 

dotenv.config();

const app = express();
const rutaImagenes = path.join(process.cwd(), 'imagenes');

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permite solicitudes solo desde este origen
  credentials: true // Permite el envío de cookies y cabeceras de autorización
}));

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// ====================================================================
// Middleware de Autenticación JWT (¡IMPORTANTE!)
// ====================================================================
app.use((req: any, res, next) => {
  console.log('--- Middleware de Autenticación JWT ---');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token recibido en header:', token ? 'Sí' : 'No');
  console.log('JWT_SECRET del .env (para firmar/verificar):', process.env.JWT_SECRET); 

  if (token == null) {
    console.log('No hay token en la cabecera. Continuando sin usuario autenticado.');
    return next(); 
  }

  // Verifica el token
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("ERROR: JWT_SECRET no está definido en las variables de entorno del servidor. No se puede verificar el token.");
    return next(); 
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      // Si el token no es válido (expirado, modificado, etc.)
      console.error("Error al verificar JWT (jwt.verify):", err.message);
      // Si el error es 'invalid signature', es casi seguro que el secreto no coincide.
      if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
        console.error("POSIBLE PROBLEMA: El JWT_SECRET usado para verificar NO COINCIDE con el usado para firmar.");
      } else if (err.name === 'TokenExpiredError') {
        console.error("El token JWT ha expirado.");
      }
      return next(); 
    }
    
    // Si el token es válido, asigna el payload decodificado a req.user
    // El payload debe contener { userId, rol }
    req.user = user; 
    console.log('Token verificado exitosamente. req.user asignado:', req.user);
    next(); 
  });
});

// ====================================================================
// Rutas de la API (asegúrate de que los prefijos y nombres coincidan)
// ====================================================================
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/noticia', noticiaRoutes);
app.use('/api/admin/users', listausersRoutes); 
app.use('/static', express.static(rutaImagenes));


// Inicialización del servidor
const PORT = process.env.PORT || 3001; // Puerto del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// Manejo de cierre de la aplicación para desconectar Prisma Client de forma segura
const prisma = new PrismaClient(); // Crea una instancia de Prisma Client
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client desconectado al cerrar la aplicación.');
});

// También puedes manejar SIGINT (Ctrl+C) para una salida limpia
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Prisma Client desconectado debido a SIGINT (Ctrl+C).');
  process.exit(0);
});
