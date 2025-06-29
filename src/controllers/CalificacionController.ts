import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const comprobarCompra = async (Usuario_UsuarioID: number, Juego_JuegoID: number) => {
  const compraExistente = await prisma.venta.findFirst({
    where: {
      Usuario_UsuarioID: Usuario_UsuarioID,
      Juego_JuegoID: Juego_JuegoID,
    },
  });

  return compraExistente ? true : false;
};

export const verificarCompra = async (req: Request, res: Response) => {
  const { Usuario_UsuarioID, Juego_JuegoID } = req.body;

  try {
    const juegoComprado = await comprobarCompra(Usuario_UsuarioID, Juego_JuegoID);

    if (juegoComprado) {
      res.status(200).json({ message: 'El usuario ha comprado este juego.' });
    } else {
      res.status(400).json({ error: 'El usuario no ha comprado este juego.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar la compra.' });
  }
};

export const dejarCalificacion = async (req: Request, res: Response) => {
  const { Usuario_UsuarioID, Juego_JuegoID, Valoracion, Comentario } = req.body;

  try {
    // Verificar si el usuario ha comprado el juego previamente usando la función separada
    const juegoComprado = await comprobarCompra(Usuario_UsuarioID, Juego_JuegoID);

    if (!juegoComprado) {
      res.status(400).json({ error: 'No has comprado este juego' });
      return;
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
    return;
  }
};