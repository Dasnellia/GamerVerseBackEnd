import { Router } from 'express';
import * as usuarioController from '../controllers/UsuarioController';
import { validarRegistro } from '../middleware/validarRegistro';

const router = Router();

router.post('/registro', validarRegistro, usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/', usuarioController.listar);
router.put('/:id', usuarioController.editar);
router.delete('/:id', usuarioController.eliminar);
router.get('/verificar/:token', usuarioController.verificarCuenta);

export default router;
