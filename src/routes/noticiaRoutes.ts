import { Router } from 'express';
import * as NoticiaController from '../controllers/NoticiaController'; 

import { verificarAdmin } from '../middleware/authMiddleware';


const router = Router();

// Ruta pública para el carrusel (no necesita autenticación)
router.get("/public", NoticiaController.getAllNoticias);


// GET: Obtener todas las noticias
router.get("/", verificarAdmin, NoticiaController.getAllNoticias);

// GET: Obtener una noticia por ID
router.get("/:id", verificarAdmin, NoticiaController.getNoticiaById);


// GET: Obtener una noticia por ID (PARA ADMINISTRADORES)
router.get("/:id", verificarToken, NoticiaController.authenticateAdmin, NoticiaController.getNoticiaById);


// POST: Crear una nueva noticia (protegida por authenticateAdmin)
router.post("/", verificarAdmin, NoticiaController.crearNoticia);

// PUT: Actualizar una noticia existente (protegida por authenticateAdmin)
router.put("/:id", verificarAdmin, NoticiaController.editarNoticia);

// DELETE: Eliminar una noticia (protegida por authenticateAdmin)
router.delete("/:id", verificarAdmin, NoticiaController.borrarNoticia);


export default router;