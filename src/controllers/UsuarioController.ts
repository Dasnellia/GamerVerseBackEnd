import { Request, Response } from 'express';
import * as UsuarioService from '../services/usuarioService';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export const login = async (req: Request, res: Response) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Correo: correo },
          { UsuarioID: correo }
        ]
      }
    });

    if (usuario === null) {
      res.status(401).json({ error: 'Usuario no encontrado' });
    } else {
      const coincide = await bcrypt.compare(contrasena, usuario.Password);

      if (!coincide) {
        res.status(401).json({ error: 'Contraseña incorrecta' });
      } else {
        if (!usuario.Verificado) {
          res.status(403).json({ error: 'Debes confirmar tu cuenta desde el correo' });
        } else {
          res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
        }
      }
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const registrar = async (req: Request, res: Response) => {
  try {
    const usuario = await UsuarioService.registrarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const verificarCuenta = async (req: Request, res: Response) => {
  const { Token } = req.params;

  const usuario = await prisma.usuario.findFirst({ where: { Token } });

  if (!usuario) {
    res.status(400).json({ error: 'Token inválido' });
  } else {
    await prisma.usuario.update({
      where: { UsuarioID: usuario.UsuarioID },
      data: { Verificado: true, Token: null },
    });

    res.json({ mensaje: 'Cuenta verificada correctamente.' });
  }
};
export const listar = async (_req: Request, res: Response) => {
  const usuarios = await UsuarioService.obtenerUsuarios();
  res.json(usuarios);
};

export const editar = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const usuario = await UsuarioService.actualizarUsuario(id, req.body);
    res.json(usuario);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await UsuarioService.eliminarUsuario(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};