import { Router } from 'express';
import * as juegoController from '../controllers/JuegoController';

const router = Router();

router.get('/filtros', juegoController.filtrarJuegos);

router.get('/:id', juegoController.obtenerPorId);
router.post('/', juegoController.crearJuego);
router.put('/:id', juegoController.actualizarJuego);
router.delete('/:id', juegoController.eliminarJuego);
router.get('/', juegoController.obtenerTodos);
router.post('/resena', juegoController.dejarCalificacion);

//TEMPORAL PARA ELIMINAR JUEGOS
router.delete('/', juegoController.eliminarTodos);


export default router;
