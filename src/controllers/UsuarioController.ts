import { Request, Response } from 'express';
import * as UsuarioService from '../services/usuarioService';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { correo: correoONickname, contrasena } = req.body;

    // --- LOGS DE DEPURACIÓN ---
    console.log('--- Intento de Login ---');
    console.log('Correo/Nickname recibido:', correoONickname);
    console.log('Contraseña en texto plano recibida:', contrasena); // ¡CUIDADO: No loguear esto en producción!

    const result = await UsuarioService.iniciarSesion(correoONickname, contrasena);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token: result.token,
      usuario: {
        nickname: result.usuario.Nombre,
        tipo: result.usuario.Admin ? 'admin' : 'user',
        id: result.usuario.UsuarioID,
        correo: result.usuario.Correo,
        foto: result.usuario.Foto,
      }
    });

  } catch (error: any) {
    console.error('Error en login (controlador):', error); // Log del error en el controlador
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('cuenta aún no ha sido verificada')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
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
