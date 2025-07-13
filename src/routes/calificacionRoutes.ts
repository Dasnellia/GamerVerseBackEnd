import { Router } from 'express';
import { dejarCalificacion, verificarCompra } from '../controllers/CalificacionController';

const router = Router();

router.post('/verificarCompra', verificarCompra);
router.post('/dejarCalificacion', dejarCalificacion);

export default router;
