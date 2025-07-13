
import express, { Request, Response, Router, NextFunction } from 'express';
import * as listadoUsuarioService from '../services/listauserService'; 


interface AuthenticatedRequest extends Request {
  user?: {
    UsuarioID: number;
    Admin: boolean;
  };
}


// GET: Mostrar la lista de todos los usuarios
export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.Admin) {
      res.status(403).json({ msg: "Acceso denegado: Se requiere rol de administrador." });
      return;
    }

    // Si es administrador, se obtiene la lista
    const usuarios = await listadoUsuarioService.getAllUsers();
    res.json(usuarios);

  } catch (error: any) {
    console.error("Error al obtener la lista de usuarios en el controlador:", error);
    res.status(500).json({ msg: error.message || "Error interno del servidor al obtener los usuarios." });
  }
};