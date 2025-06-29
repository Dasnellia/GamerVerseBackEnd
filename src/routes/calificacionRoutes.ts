import { Router } from 'express';
import * as calificacionController from '../controllers/CalificacionController';

const router = Router();

// Ruta para dejar una calificación
router.post('/dejarCalificacion', calificacionController.dejarCalificacion);
router.post('/verificarCompra', calificacionController.verificarCompra);

export default router;