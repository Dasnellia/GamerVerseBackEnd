import { Router } from 'express';
import { verificarToken } from '../middleware/authMiddleware';
import * as CarritoController from '../controllers/CarritoController';

const router = Router();

router.get("/", verificarToken, CarritoController.getCarrito); 
router.post("/items", verificarToken, CarritoController.addUpCarritoItem); 
router.delete("/items/:JuegoID", verificarToken, CarritoController.borrarCarritoItem); 
router.delete("/", verificarToken, CarritoController.limpiarCarrito); 

export default router;
