import { Router, Request, Response } from 'express';
import * as juegoController from '../controllers/JuegoController';
import { PrismaClient } from "../generated/prisma"

const router = Router();
const prisma = new PrismaClient()
router.get('/filtros', juegoController.filtrarJuegos);

router.get('/:id', juegoController.obtenerPorId);
router.post('/', juegoController.crearJuego);
router.put('/:id', juegoController.actualizarJuego);
router.delete('/:id', juegoController.eliminarJuego);
router.get('/', juegoController.obtenerTodos);
router.post('/resena', juegoController.dejarCalificacion);

//TEMPORAL PARA ELIMINAR JUEGOS
router.delete('/', juegoController.eliminarTodos);

router.get("/search", async (req: Request, res: Response) => {
  const search = req.query.search?.toString().trim() || ""

  try {
    const juegos = await prisma.juego.findMany({
      where: {
        Nombre: {
          contains: search,
          mode: "insensitive", // ignora mayúsculas/minúsculas
        }
      },
      take: 20 // Limita resultados (opcional)
    })

    res.json(juegos)
  } catch (error) {
    console.error("Error al buscar juegos:", error)
    res.status(500).json({ msg: "No se pudo buscar juegos" })
  }
})

export default router;
