import express, { Request, Response, Router, NextFunction } from 'express';
import * as listadoUsuarioService from '../services/listauserService'; 

interface AuthenticatedRequest extends Request {
  user?: { id: number; rol: string };
}

const ListadoUsuarioController = (): Router => {
  const router = express.Router();

  const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    console.log('--- Middleware authenticateAdmin ---');
    console.log('req.user en authenticateAdmin (después de JWT verification):', req.user);
    const userRole = req.user?.rol;
    console.log('userRole extraído en authenticateAdmin:', userRole); 

    if (!userRole || userRole !== 'ADMIN') { 
      console.log('Acceso denegado: userRole no es ADMIN o no existe.');
      res.status(403).json({ msg: "Acceso denegado: Se requiere rol de administrador." });
      return;
    }
    console.log('Acceso permitido: userRole es ADMIN. Continuando con la ruta.');
    next();
  };

  // GET: Mostrar la lista de todos los usuarios
  router.get("/", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
    console.log('--- Entrando a la ruta GET /api/admin/users (después de autenticación) ---');
    try {
      const usuarios = await listadoUsuarioService.getAllUsers();
      res.json(usuarios);
    } catch (error: any) {
      console.error("Error al obtener la lista de usuarios en el controlador:", error);
      res.status(500).json({ msg: error.message || "Error interno del servidor al obtener los usuarios." });
    }
  });

  return router;
};

export default ListadoUsuarioController;
