import express, { Request, Response, Router, NextFunction } from 'express';
<<<<<<< HEAD
import * as listadoUsuarioService from '../services/listauserService'; 
=======
import * as listadoUsuarioService from '../services/listauserService';
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d

interface AuthenticatedRequest extends Request {
  user?: { id: number; rol: string };
}

const ListadoUsuarioController = (): Router => {
  const router = express.Router();

  const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
<<<<<<< HEAD
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
=======
    const userRole = req.user?.rol;
    if (!userRole || userRole !== 'ADMIN') {
      res.status(403).json({ msg: "Acceso denegado: Se requiere rol de administrador." });
      return;
    }
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
    next();
  };

  // GET: Mostrar la lista de todos los usuarios
  router.get("/", authenticateAdmin, async (req: AuthenticatedRequest, res: Response) => {
<<<<<<< HEAD
    console.log('--- Entrando a la ruta GET /api/admin/users (después de autenticación) ---');
=======
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
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
