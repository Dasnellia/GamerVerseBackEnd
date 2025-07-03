import { Router } from 'express';
import * as CarritoController from '../controllers/CarritoController'; 

const router = Router();

// GET: Obtiene todos los ítems del carrito del usuario .
router.get("/", CarritoController.getCarrito);

// POST: Añade o actualiza la cantidad de un ítem existente.
router.post("/items", CarritoController.addUpCarritoItem);

// DELETE: Elimina un ítem específico del carrito según el ID.
router.delete("/items/:JuegoID", CarritoController.borrarCarritoItem);

// DELETE: Vacía el carrito del usuario.
router.delete("/", CarritoController.limpiarCarrito);

export default router;
