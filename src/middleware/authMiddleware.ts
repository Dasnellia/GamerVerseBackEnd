import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      UsuarioID: number;
      Admin: boolean; 
    };
  }
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔍 [verificarToken] Verificando token...');
  
  const authHeader = req.headers['authorization'];
  console.log('📋 [verificarToken] Header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('🎟️ [verificarToken] Token extraído:', token ? `${token.substring(0, 20)}...` : 'null');

  if (token == null) {
    console.log('❌ [verificarToken] No token found');
    res.status(401).json({ msg: 'Acceso denegado. No se proporcionó token de autenticación.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("❌ [verificarToken] JWT_SECRET no definido");
    res.status(500).json({ msg: 'Error de configuración del servidor.' });
    return;
  }


  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {

    if (err) {
      console.error("❌ [verificarToken] Error al verificar JWT:", err.message);
      res.status(403).json({ msg: 'Token inválido o expirado.' });
      return;
    }
    
    console.log('✅ [verificarToken] Token decodificado:', decoded);
    req.user = decoded; // ✅ CAMBIAR: usar 'decoded' no 'user'
    console.log('👤 [verificarToken] req.user asignado:', req.user);
    next();
  });
};

export const verificarAdmin = (req: Request, res: Response, next: NextFunction): void => {
  console.log('🔍 [verificarAdmin] Verificando admin...');
  console.log('👤 [verificarAdmin] req.user:', req.user);
  
  if (!req.user) {
    console.log('❌ [verificarAdmin] No hay req.user');
    res.status(401).json({ msg: 'Usuario no autenticado.' });
    return;
  }

  console.log('🔑 [verificarAdmin] Admin status:', req.user.Admin);
  
  if (!req.user.Admin) {  
    console.log('❌ [verificarAdmin] Usuario no es admin');
    res.status(403).json({ msg: 'Acceso denegado: solo administradores.' });
    return;
  }

  console.log('✅ [verificarAdmin] Usuario es admin, acceso permitido');
  next();
};