import { Router } from 'express';
import * as pagoController from '../controllers/PagoController';

const router = Router();

// Ruta para realizar el pago
router.post('/realizar', pagoController.procesarPago);

export default router;