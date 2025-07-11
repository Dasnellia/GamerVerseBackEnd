import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

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
// Definición del Middleware de Autenticación JWT 
// ====================================================================

// Extiende la interfaz Request para incluir la propiedad 'user'
interface AuthenticatedRequest extends Request {
    user?: { userId: number; rol: string }; 
}

const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log('\n--- INICIO MIDDLEWARE AUTHENTICATEJWT ---');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('1. Cabecera Authorization recibida:', authHeader);
    console.log('2. Token extraído:', token ? 'Presente' : 'Ausente');

    if (!token) {
        console.log('3. Resultado: NO TOKEN. Acceso denegado (401).');
        res.status(401).json({ msg: "Acceso denegado. No se proporcionó token de autenticación." });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    console.log('4. JWT_SECRET configurado en .env:', jwtSecret ? 'Presente' : 'Ausente');

    if (!jwtSecret) {
        console.error("ERROR: JWT_SECRET no está definido en las variables de entorno. No se puede verificar el token.");
        res.status(500).json({ msg: "Error de configuración del servidor." });
        return;
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
            console.error("5. ERROR AL VERIFICAR JWT:", err.message);
            if (err.name === 'TokenExpiredError') {
                console.error("   Detalle: El token ha expirado.");
            } else if (err.name === 'JsonWebTokenError') {
                console.error("   Detalle: Token inválido (ej. firma incorrecta, malformado).");
            }
            res.status(403).json({ msg: "Token inválido o expirado." });
            return;
        }

        // Asegúrate de que el payload del token contenga 'userId' y 'rol'
        // Si tu token usa 'id' en lugar de 'userId', ajusta esto: req.user = { userId: user.id, rol: user.rol };
        req.user = { userId: user.userId, rol: user.rol }; 
        console.log('5. Resultado: Token verificado exitosamente. req.user asignado:', req.user);
        console.log('--- FIN MIDDLEWARE AUTHENTICATEJWT ---\n');
        next();
    });
};

// ====================================================================
// Rutas de la API (asegúrate de que los prefijos y nombres coincidan)
// ====================================================================
// Rutas públicas (no requieren autenticación)
app.use('/api/usuarios', usuarioRoutes); // Asumo que esta ruta incluye login/registro
app.use('/api/juegos', juegoRoutes);
app.use('/api/noticia', noticiaRoutes);
app.use('/static', express.static(rutaImagenes));
app.use('/api/carrito', authenticateJWT, carritoRoutes);
app.use('/api/admin/users', authenticateJWT, listausersRoutes); // Si esta ruta es solo para admin

// Inicialización del servidor
const PORT = process.env.PORT || 3001; // Puerto del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});