import { Request, Response } from 'express';
import * as juegoService from '../services/juegoService';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient()

export const obtenerTodos = async (_req: Request, res: Response) => {
    const juegos = await juegoService.obtenerTodos();
    res.json(juegos);
};

export const obtenerPorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const juego = await juegoService.obtenerPorId(id);

    if (!juego) res.status(404).json({ error: 'Juego no encontrado' });
    res.json(juego);
};
export const crearJuego = async (req: Request, res: Response) => {
    try {
        const nuevoJuego = await juegoService.crearJuego(req.body);
        res.status(201).json(nuevoJuego);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear juego', detalle: error });
    }
};

export const actualizarJuego = async (req: Request, res: Response) => {
    try {
        const juego = await juegoService.actualizarJuego(+req.params.id, req.body);
        res.json(juego);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar juego', detalle: error });
    }
};

export const eliminarJuego = async (req: Request, res: Response) => {
    try {
        await juegoService.eliminarJuego(+req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar juego', detalle: error });
    }
};

export const filtrarJuegos = async (req: Request, res: Response) => {
    const { nombre, plataforma, precioMin, precioMax } = req.query;

    const juegos = await juegoService.filtrarConLogica({
        nombre: nombre as string,
        plataforma: plataforma as string,
        precioMin: precioMin ? parseFloat(precioMin as string) : undefined,
        precioMax: precioMax ? parseFloat(precioMax as string) : undefined,
    });

    res.json(juegos);
};

//TEMPORAL PARA ELIMINAR TODOS LOS JUEGOS

export const eliminarTodos = async (_req: Request, res: Response) => {
    try {
        await prisma.juego.deleteMany(); // Elimina todos los juegos
        res.json({ mensaje: 'Todos los juegos fueron eliminados.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los juegos', detalle: error });
    }
};

export const dejarCalificacion = async (req: Request, res: Response) => {
    const { Usuario_UsuarioID, Juego_JuegoID, Valoracion, Comentario } = req.body;

    try {
        const calificacion = await prisma.calificacion.create({
            data: {
              Usuario_UsuarioID: Usuario_UsuarioID,
              Juego_JuegoID: Juego_JuegoID,
              Valoracion: Valoracion,
              Comentario: Comentario,
            },
          });

        res.status(201).json(calificacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al dejar la reseña' });
    }
};