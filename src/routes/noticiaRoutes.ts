import { Router } from 'express';
// Importa las funciones del controlador individualmente
import * as NoticiaController from '../controllers/NoticiaController'; 

const router = Router();

// --- Rutas Públicas   ---

// GET: Obtener todas las noticias
router.get("/", NoticiaController.getAllNoticias);

// GET: Obtener una noticia por ID
router.get("/:id", NoticiaController.getNoticiaById);

// --- Rutas Protegidas   ---

// POST: Crear una nueva noticia (protegida por authenticateAdmin)
router.post("/", NoticiaController.authenticateAdmin, NoticiaController.crearNoticia);

// PUT: Actualizar una noticia existente (protegida por authenticateAdmin)
router.put("/:id", NoticiaController.authenticateAdmin, NoticiaController.editarNoticia);

// DELETE: Eliminar una noticia (protegida por authenticateAdmin)
router.delete("/:id", NoticiaController.authenticateAdmin, NoticiaController.borrarNoticia);

export default router;
