import { Router } from 'express';
import ListaUserController from '../controllers/ListaUserController'; 

const router = Router();

const listauserRouter = ListaUserController();

router.use('/', listauserRouter);

export default router;
