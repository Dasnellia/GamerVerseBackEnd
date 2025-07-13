import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      UsuarioID: number;
      Admin: boolean; // <--- ¡Esto es clave!
    };
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({ msg: 'Acceso denegado. No se proporcionó token de autenticación.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("ERROR: JWT_SECRET no está definido en las variables de entorno del servidor.");
    res.status(500).json({ msg: 'Error de configuración del servidor.' });
    return;
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => { // <--- 'user' aquí es el payload decodificado
    if (err) {
      console.error("Error al verificar JWT:", err.message);
      res.status(403).json({ msg: 'Token inválido o expirado.' });
      return;
    }
    req.user = user; // <--- Se asigna el payload decodificado a req.user
    next();
  });
};