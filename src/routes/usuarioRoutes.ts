// backend/src/routes/usuarioRoutes.ts (después de la modificación)
import { Router } from 'express';
import * as usuarioController from '../controllers/UsuarioController';


import { validarRegistro } from '../middleware/validarRegistro'; 
import { validarCambioContrasena } from '../middleware/validarCambioContrasena'; 

import { verificarToken } from '../middleware/authMiddleware';


const router = Router();

// Rutas de Autenticación (PÚBLICAS - NO requieren verificarToken)
router.post('/registro', validarRegistro, usuarioController.registrar);
router.post('/login', usuarioController.login);
router.post('/verificar-cuenta', usuarioController.verificarCuenta);

router.post('/olvide-contrasena', usuarioController.olvideContrasena);
router.post('/restablecer-contrasena', validarCambioContrasena, usuarioController.restablecerContrasena);

// Rutas de gestión de usuarios (PROTEGIDAS - SÍ requieren verificarToken)

router.get('/', verificarToken, usuarioController.listar);
router.put('/:id', verificarToken, usuarioController.editar); 
router.delete('/:id', verificarToken, usuarioController.eliminar); 


export default router;