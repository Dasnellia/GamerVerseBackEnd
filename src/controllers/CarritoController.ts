import { Request, Response, RequestHandler } from 'express'; 
import * as carritoService from '../services/carritoService'; 

interface AuthenticatedRequest extends Request {
  user?: { id: number }; 
}

// GET: Obtener carrito
export const getCarrito: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  const usuarioID = req.user?.id;

  if (usuarioID === undefined) {
    res.status(401).json({ msg: "No autorizado: Usuario no identificado." });
    return; 
  }

  try {
    const carritoData = await carritoService.getCarritoItems(usuarioID);
    res.json(carritoData);
  } catch (error: any) {
    console.error("Error en getCarrito:", error);
    res.status(500).json({ msg: error.message || "Error interno del servidor al obtener el carrito." });
  }
};

// POST: Añadir o actualizar un ítem en el carrito.
export const addUpCarritoItem: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  const usuarioID = req.user?.id;
  const { juegoId, cantidad } = req.body;

  if (usuarioID === undefined) {
    res.status(401).json({ msg: "No autorizado: Usuario no identificado." });
    return; 
  }
  if (juegoId === undefined || typeof juegoId !== 'number' || cantidad === undefined || typeof cantidad !== 'number' || cantidad < 1) {
    res.status(400).json({ msg: "Debe enviar 'juegoId' (número) y 'cantidad' (número > 0)." });
    return; 
  }

  try {
    const carritoActualizado = await carritoService.addUpCarritoItem(usuarioID, juegoId, cantidad);
    res.status(200).json({
      msg: "Ítem añadido/actualizado en el carrito con éxito.",
      ...carritoActualizado, 
    });
  } catch (error: any) {
    console.error("Error en addUpCarritoItem:", error);
    if (error.message === "Juego no encontrado." || error.message.startsWith("La cantidad solicitada")) {
      res.status(404).json({ msg: error.message });
      return; 
    }
    res.status(500).json({ msg: error.message || "Error interno del servidor al añadir/actualizar ítem." });
  }
};

// DELETE: Eliminar un ítem específico del carrito.
export const borrarCarritoItem: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  const usuarioID = req.user?.id;
  const juegoID = parseInt(req.params.JuegoID);

  if (usuarioID === undefined) {
    res.status(401).json({ msg: "No autorizado: Usuario no identificado." });
    return; 
  }
  if (isNaN(juegoID)) {
    res.status(400).json({ msg: "ID de juego inválido." });
    return; 
  }

  try {
    const carritoActualizado = await carritoService.borrarCarritoItem(usuarioID, juegoID);
    res.status(200).json({
      msg: "Ítem eliminado del carrito con éxito.",
      ...carritoActualizado, 
    });
  } catch (error: any) {
    console.error("Error en borrarCarritoItem:", error);
    if (error.message === "El juego no se encontró en el carrito de este usuario.") {
      res.status(404).json({ msg: error.message });
      return; 
    }
    res.status(500).json({ msg: error.message || "Error interno del servidor al eliminar item." });
  }
};

// DELETE: Vaciar el carrito
export const limpiarCarrito: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
  const usuarioID = req.user?.id;

  if (usuarioID === undefined) {
    res.status(401).json({ msg: "No autorizado: Usuario no identificado." });
    return; 
  }

  try {
    const result = await carritoService.limpiarCarrito(usuarioID);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error en limpiarCarrito:", error);
    res.status(500).json({ msg: error.message || "Error interno del servidor al vaciar el carrito." });
  }
};