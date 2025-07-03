import { Router } from 'express';
import { dejarCalificacion } from '../controllers/CalificacionController';

const router = Router();

// Ruta para dejar una calificación
router.post('/dejar', dejarCalificacion);

export default router;
