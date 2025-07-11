import { Router } from 'express';
import * as NoticiaController from '../controllers/NoticiaController'; 

const router = Router();

<<<<<<< HEAD
// --- Rutas Públicas   ---
=======
router.get("/public", NoticiaController.getAllNoticias);

>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
// GET: Obtener todas las noticias
router.get("/", NoticiaController.authenticateAdmin, NoticiaController.getAllNoticias);

// GET: Obtener una noticia por ID
router.get("/:id", NoticiaController.authenticateAdmin, NoticiaController.getNoticiaById);

<<<<<<< HEAD
// --- Rutas Protegidas   ---
=======
>>>>>>> 5968b58 (Merge BackEndAle y BackEndJharif)
// POST: Crear una nueva noticia (protegida por authenticateAdmin)
router.post("/", NoticiaController.authenticateAdmin, NoticiaController.crearNoticia);

// PUT: Actualizar una noticia existente (protegida por authenticateAdmin)
router.put("/:id", NoticiaController.authenticateAdmin, NoticiaController.editarNoticia);

// DELETE: Eliminar una noticia (protegida por authenticateAdmin)
router.delete("/:id", NoticiaController.authenticateAdmin, NoticiaController.borrarNoticia);

export default router;