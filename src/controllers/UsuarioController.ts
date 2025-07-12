// src/controllers/UsuarioController.ts
import { Request, Response, RequestHandler } from 'express';
import * as UsuarioService from '../services/usuarioService';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma';
import crypto from 'crypto';

// --- ¡CAMBIO CRÍTICO AQUÍ! ---
// La ruta correcta para tu mailer.js es '../utils/mailer'
import { enviarCorreoVerificacion, enviarCorreoRestablecimientoContrasena } from '../services/emailService'; 

const prisma = new PrismaClient();

// --- Funciones de Utilidad (Internas del Controlador) ---
export const buscarUsuarioPorIdentificador = async (identifier: string) => {
    return await prisma.usuario.findFirst({
        where: {
            OR: [
                { Correo: identifier },
                { Nombre: identifier }
            ]
        }
    });
};

export const buscarUsuarioPorTokenRestablecimiento = async (token: string) => {
    return await prisma.usuario.findFirst({
        where: {
            ContrasenaTokenReset: token,
            ContrasenaExpira: {
                gt: new Date()
            }
        }
    });
};

export const actualizarDatosUsuario = async (userId: number, dataToUpdate: any) => {
    return await prisma.usuario.update({
        where: { UsuarioID: userId },
        data: dataToUpdate
    });
};



// --- FIN Funciones de Utilidad ---


// --- Controladores Principales (Manejan las solicitudes HTTP) ---

export const login: RequestHandler = async (req, res) => {
    try {
        const { correo: correoONickname, contrasena } = req.body;
        console.log('--- Intento de Login ---');
        console.log('Correo/Nickname recibido:', correoONickname);

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
                pais: result.usuario.Pais,
            }
        });
    } catch (error: any) {
        console.error('Error en login (controlador):', error);
        if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
            res.status(401).json({ error: error.message });
        } else if (error.message.includes('cuenta aún no ha sido verificada')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

export const registrar: RequestHandler = async (req, res) => {
    try {
        const usuario = await UsuarioService.registrarUsuario(req.body);
        res.status(201).json(usuario);
    } catch (err: any) {
        console.error('Error en controlador registrar:', err);
        res.status(400).json({ error: err.message });
    }
};

export const verificarCuenta: RequestHandler = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            res.status(400).json({ error: 'Token de verificación no proporcionado.' });
            return;
        }

        const resultado = await UsuarioService.verificarTokenYCuenta(token);
        res.status(200).json(resultado);
    } catch (error: any) {
        console.error('Error en controlador verificarCuenta:', error);
        res.status(400).json({ error: error.message || 'Error al verificar la cuenta.' });
    }
};

export const listar: RequestHandler = async (_req, res) => {
    try {
        const usuarios = await UsuarioService.obtenerUsuarios();
        res.json(usuarios);
    } catch (error: any) {
        console.error('Error en controlador listar usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
};

export const editar: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID de usuario inválido.' });
      return;
    }
  
    try {
      const { nombre, apellidos, correoElectronico } = req.body; // Nuevos campos que puedes permitir editar
      const usuarioActualizado = await actualizarDatosUsuario(id, {
        Nombre: nombre,
        Apellidos: apellidos,
        Correo: correoElectronico,
      });
      res.json(usuarioActualizado);
    } catch (err: any) {
      console.error('Error en controlador editar usuario:', err);
      res.status(400).json({ error: err.message });
    }
  };

export const eliminar: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID de usuario inválido.' });
        return;
    }
    try {
        await UsuarioService.eliminarUsuario(id);
        res.status(204).send();
    } catch (err: any) {
        console.error('Error en controlador eliminar usuario:', err);
        res.status(400).json({ error: err.message });
    }
};

export const olvideContrasena: RequestHandler = async (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        res.status(400).json({ msg: 'Por favor, ingrese su correo electrónico o nombre de usuario.' });
        return;
    }

    try {
        const user = await buscarUsuarioPorIdentificador(identifier);

        if (!user) {
            console.log(`Intento de restablecimiento para identificador no encontrado: ${identifier}`);
            res.status(200).json({ msg: 'Si su correo electrónico o nombre de usuario está en nuestro sistema, recibirá un enlace para restablecer su contraseña.' });
            return;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hora de expiración

        await actualizarDatosUsuario(user.UsuarioID, {
            ContrasenaTokenReset: resetToken,
            ContrasenaExpira: resetExpires
        });

        await enviarCorreoRestablecimientoContrasena(user.Correo, resetToken);

        res.status(200).json({ msg: 'Si su correo electrónico o nombre de usuario está en nuestro sistema, recibirá un enlace para restablecer su contraseña.' });

    } catch (error: any) {
        console.error('Error en olvideContrasena (controlador):', error);
        res.status(500).json({ msg: 'Error interno del servidor al procesar la solicitud de restablecimiento.' });
    }
};

export const restablecerContrasena: RequestHandler = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400).json({ msg: 'Faltan el token o la nueva contraseña.' });
        return;
    }

    if (newPassword.length < 8) {
        res.status(400).json({ msg: 'La nueva contraseña debe tener al menos 8 caracteres.' });
        return;
    }

    try {
        const user = await buscarUsuarioPorTokenRestablecimiento(token);

        if (!user) {
            res.status(400).json({ msg: 'El token de restablecimiento es inválido o ha expirado. Por favor, solicite uno nuevo.' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await actualizarDatosUsuario(user.UsuarioID, {
            Password: hashedPassword,
            ContrasenaTokenReset: null,
            ContrasenaExpira: null
        });

        res.status(200).json({ msg: 'Contraseña restablecida exitosamente. Ahora puede iniciar sesión con su nueva contraseña.' });

    } catch (error: any) {
        console.error('Error en restablecerContrasena (controlador):', error);
        res.status(500).json({ msg: 'Error interno del servidor al restablecer la contraseña.' });
    }
};