import { Router } from 'express';

import * as NoticiaController from '../controllers/NoticiaController'; 

const router = Router();


router.get("/public", NoticiaController.getAllNoticias);

// GET: Obtener todas las noticias
router.get("/", NoticiaController.authenticateAdmin, NoticiaController.getAllNoticias);

// GET: Obtener una noticia por ID
router.get("/:id", NoticiaController.authenticateAdmin, NoticiaController.getNoticiaById);


// POST: Crear una nueva noticia (protegida por authenticateAdmin)
router.post("/", NoticiaController.authenticateAdmin, NoticiaController.crearNoticia);

// PUT: Actualizar una noticia existente (protegida por authenticateAdmin)
router.put("/:id", NoticiaController.authenticateAdmin, NoticiaController.editarNoticia);

// DELETE: Eliminar una noticia (protegida por authenticateAdmin)
router.delete("/:id", NoticiaController.authenticateAdmin, NoticiaController.borrarNoticia);

export default router;