import { Router } from 'express';
import NoticiasController from '../controllers/NoticiaController'; 

const router = Router();

const noticiasRouter = NoticiasController();

// --- Rutas Públicas  ---

// GET: Obtener todas las noticias
router.get("/", NoticiasController().get("/", (req, res) => {})); 

// GET: Obtener una noticia por ID
router.get("/:id", NoticiasController().get("/:id", (req, res) => {})); 

// --- Rutas Protegidas  ---

// POST: Crear una nueva noticia
router.post("/", NoticiasController().post("/", (req, res) => {})); 

// PUT: Actualizar una noticia existente
router.put("/:id", NoticiasController().put("/:id", (req, res) => {}));

// DELETE: Eliminar una noticia
router.delete("/:id", NoticiasController().delete("/:id", (req, res) => {})); 


export default router;
