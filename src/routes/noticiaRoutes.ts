import { Router } from 'express';
import * as NoticiaController from '../controllers/NoticiaController'; 
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

// Ruta pública para el carrusel (no necesita autenticación)
router.get("/public", NoticiaController.getAllNoticias);

// GET: Obtener todas las noticias (PARA ADMINISTRADORES)
router.get("/", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.getAllNoticias);

// GET: Obtener una noticia por ID (PARA ADMINISTRADORES)
router.get("/:id", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.getNoticiaById);

// POST: Crear una nueva noticia
router.post("/", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.crearNoticia);

// PUT: Actualizar una noticia existente
router.put("/:id", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.editarNoticia);

// DELETE: Eliminar una noticia
router.delete("/:id", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.borrarNoticia);

export default router;