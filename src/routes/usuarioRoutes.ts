import { Router } from 'express';
import * as usuarioController from '../controllers/UsuarioController';
<<<<<<< HEAD
import { validarRegistro } from '../middleware/validarRegistro';
=======

import { validarRegistro } from '../middleware/validarRegistro'; 
import { validarCambioContrasena } from '../middleware/validarCambioContrasena'; 

import { verificarToken } from '../middleware/authMiddleware';
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)

const router = Router();

router.post('/registro', validarRegistro, usuarioController.registrar);
router.post('/login', usuarioController.login);
<<<<<<< HEAD
router.get('/', usuarioController.listar);
router.put('/:id', usuarioController.editar);
router.delete('/:id', usuarioController.eliminar);
router.get('/verificar/:token', usuarioController.verificarCuenta);

export default router;
=======
router.post('/verificar-cuenta', usuarioController.verificarCuenta);
router.post('/olvide-contrasena', usuarioController.olvideContrasena);
router.post('/restablecer-contrasena', validarCambioContrasena, usuarioController.restablecerContrasena);

// Rutas de gestión de usuarios (PROTEGIDAS - SÍ requieren verificarToken)
router.get('/', verificarToken, usuarioController.listar);
router.put('/:id', verificarToken, usuarioController.editar); 
router.delete('/:id', verificarToken, usuarioController.eliminar); 

export default router;
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
