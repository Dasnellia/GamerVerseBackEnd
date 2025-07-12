import { Router } from 'express';
import { verificarToken } from '../middleware/authMiddleware';
import { getAllUsers } from '../controllers/ListaUserController';

const router = Router();

router.get("/", verificarToken, getAllUsers); 

export default router;