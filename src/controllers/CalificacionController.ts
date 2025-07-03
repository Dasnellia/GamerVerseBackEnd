import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const dejarCalificacion = async (req: Request, res: Response): Promise<any> => {
  const { Usuario_UsuarioID, Juego_JuegoID, Valoracion, Comentario } = req.body;

  try {
    // Verifica si el usuario ha comprado el juego previamente.
    const compraExistente = await prisma.venta.findFirst({
      where: {
        Usuario_UsuarioID: Usuario_UsuarioID,
        Juego_JuegoID: Juego_JuegoID,
      },
    });

    if (!compraExistente) {
      return res.status(400).json({ error: 'No has comprado este juego' });
    }

    // Crea la calificación
    const calificacionCreada = await prisma.calificacion.create({
      data: {
        Usuario_UsuarioID: Usuario_UsuarioID,
        Juego_JuegoID: Juego_JuegoID,
        Valoracion: Valoracion,
        Comentario: Comentario,
      },
    });

    res.status(201).json(calificacionCreada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al dejar la calificación' });
  }
};
