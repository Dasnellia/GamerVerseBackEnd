import { Request, Response } from 'express';
import * as carritoService from '../services/carritoService';

// Extiende Request para incluir req.user
interface AuthenticatedRequest extends Request {
<<<<<<< HEAD
  user?: { userId: number; rol: string };
=======
  user?: {
    UsuarioID: number;
    Admin: boolean;
  };
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
}

// GET /api/carrito
export const getCarrito = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
<<<<<<< HEAD
  if (!req.user?.userId) {
    res.status(401).json({ msg: 'No autorizado. Debes iniciar sesión.' });
    return;
  }

  try {
    const carrito = await carritoService.getCarritoItems(req.user.userId);
=======
  try {
    const carrito = await carritoService.getCarritoItems(req.user!.UsuarioID); 
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
    res.status(200).json(carrito);
  } catch (error: any) {
    console.error("Error en getCarrito:", error);
    res.status(500).json({ msg: error.message || "Error al obtener el carrito." });
  }
};

// POST /api/carrito/items
export const addUpCarritoItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
<<<<<<< HEAD
  if (!req.user?.userId) {
    res.status(401).json({ msg: 'No autorizado. Debes iniciar sesión.' });
    return;
  }

=======
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
  const { juegoId, cantidad } = req.body;
  if (typeof juegoId !== 'number' || typeof cantidad !== 'number' || cantidad <= 0) {
    res.status(400).json({ msg: "Datos inválidos para el ítem del carrito." });
    return;
  }

  try {
<<<<<<< HEAD
    const updated = await carritoService.addUpCarritoItem(req.user.userId, juegoId, cantidad);
=======
    const updated = await carritoService.addUpCarritoItem(req.user!.UsuarioID, juegoId, cantidad);
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("Error en addUpCarritoItem:", error);
    res.status(400).json({ msg: error.message || "Error al añadir/actualizar ítem." });
  }
};

// DELETE /api/carrito/items/:JuegoID
export const borrarCarritoItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
<<<<<<< HEAD
  if (!req.user?.userId) {
    res.status(401).json({ msg: 'No autorizado. Debes iniciar sesión.' });
    return;
  }

=======
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
  const juegoID = parseInt(req.params.JuegoID);
  if (isNaN(juegoID)) {
    res.status(400).json({ msg: "ID de juego inválido." });
    return;
  }

  try {
<<<<<<< HEAD
    const updated = await carritoService.borrarCarritoItem(req.user.userId, juegoID);
=======
    const updated = await carritoService.borrarCarritoItem(req.user!.UsuarioID, juegoID);
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("Error en borrarCarritoItem:", error);
    res.status(400).json({ msg: error.message || "Error al eliminar ítem." });
  }
};

// DELETE /api/carrito
export const limpiarCarrito = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
<<<<<<< HEAD
  if (!req.user?.userId) {
    res.status(401).json({ msg: 'No autorizado. Debes iniciar sesión.' });
    return;
  }

  try {
    const result = await carritoService.limpiarCarrito(req.user.userId);
=======
  try {
    const result = await carritoService.limpiarCarrito(req.user!.UsuarioID);
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en limpiarCarrito:", error);
    res.status(500).json({ msg: error.message || "Error al vaciar el carrito." });
  }
};
