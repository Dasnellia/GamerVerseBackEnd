import { Router } from 'express';
import { verificarAdmin, verificarToken } from '../middleware/authMiddleware';
import { 
    obtenerTotalUsuarios, 
    obtenerVentasPorMes, 
    obtenerVentasHoy 
} from '../controllers/EstadisticasController';

const router = Router();

router.get("/total-usuarios", verificarToken, verificarAdmin, obtenerTotalUsuarios);
router.get("/ventas-por-mes", verificarToken, verificarAdmin, obtenerVentasPorMes);
router.get("/ventas-hoy", verificarToken, verificarAdmin, obtenerVentasHoy);

export default router;