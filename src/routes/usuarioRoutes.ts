// backend/src/routes/usuarioRoutes.ts (después de la modificación)
import { Router } from 'express';
import * as usuarioController from '../controllers/UsuarioController';

import { validarRegistro } from '../middleware/validarRegistro'; // Tu middleware existente
import { validarCambioContrasena } from '../middleware/validarCambioContrasena'; // Tu middleware existente

import { verificarToken } from '../middleware/authMiddleware'; // <--- ¡Importa ESTE!

const router = Router();

// Rutas de Autenticación (PÚBLICAS - NO requieren verificarToken)
router.post('/registro', validarRegistro, usuarioController.registrar);
router.post('/login', usuarioController.login);
router.post('/verificar-cuenta', usuarioController.verificarCuenta);

// Rutas para restablecimiento de contraseña (PÚBLICAS - NO requieren verificarToken)
router.post('/olvide-contrasena', usuarioController.olvideContrasena);
router.post('/restablecer-contrasena', validarCambioContrasena, usuarioController.restablecerContrasena);

// Rutas de gestión de usuarios (PROTEGIDAS - SÍ requieren verificarToken)
router.get('/', verificarToken, usuarioController.listar); // Ejemplo: si listar requiere autenticación
router.put('/:id', verificarToken, usuarioController.editar); // Ejemplo: si editar requiere autenticación
router.delete('/:id', verificarToken, usuarioController.eliminar); // Ejemplo: si eliminar requiere autenticación

export default router;