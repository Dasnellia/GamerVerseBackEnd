import { Request, Response } from 'express';
import * as carritoService from '../services/carritoService';
import { enviarCorreoCompra } from '../services/emailService';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient()

export const procesarPago = async (req: Request, res: Response): Promise<any> => {
  const { usuarioId, carritoItems } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { UsuarioID: usuarioId },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const totalPago = await carritoService.calcularTotal(carritoItems);

    //Simulación de pago
    const pagoConfirmado = await carritoService.realizarPago(usuarioId, totalPago);

    if (!pagoConfirmado) {
      return res.status(400).json({ mensaje: 'Error al procesar el pago' });
    }
    await carritoService.registrarVenta(usuarioId, carritoItems, totalPago);
    const juegos = await carritoService.obtenerJuegosPorIds(carritoItems);
    await enviarCorreoCompra(usuario.Correo, juegos);
    
    res.status(200).json({ mensaje: 'Pago realizado exitosamente y claves enviadas al correo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el pago' });
  }
};