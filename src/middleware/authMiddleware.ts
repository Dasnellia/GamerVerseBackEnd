// backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      UsuarioID: number;
      Rol: string;
    };
  }
}

// Cambia el tipo de retorno explícito de la función a 'void'
export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({ msg: 'Acceso denegado. No se proporcionó token de autenticación.' });
    return; // <--- Importante: después de enviar la respuesta, se termina la ejecución aquí.
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("ERROR: JWT_SECRET no está definido en las variables de entorno del servidor.");
    res.status(500).json({ msg: 'Error de configuración del servidor.' });
    return; // <--- Importante: después de enviar la respuesta, se termina la ejecución aquí.
  }

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err) {
      console.error("Error al verificar JWT:", err.message);
      res.status(403).json({ msg: 'Token inválido o expirado.' });
      return; // <--- Importante: después de enviar la respuesta, se termina la ejecución aquí.
    }
    req.user = user;
    next(); // <--- Solo llama a next() si todo salió bien y se quiere continuar.
  });
};