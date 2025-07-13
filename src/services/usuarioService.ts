import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "../generated/prisma";

 
const prisma = new PrismaClient();

import { enviarCorreoVerificacion } from './emailService';

export const registrarUsuario = async (data: any) => {
  const { nickname, correo, contrasena, pais } = data;


  console.log(`[RegistrarUsuario] Inicio del proceso de registro para: ${correo}`);

  const existeCorreo = await prisma.usuario.findUnique({ where: { Correo: correo } });
  if (existeCorreo) {
    console.log(`[RegistrarUsuario] Error: El correo ${correo} ya está registrado. Lanzando error.`);
    throw new Error('El correo ya está registrado.');
  }
  console.log(`[RegistrarUsuario] Correo ${correo} no existe, continuando con el registro.`);

  const hash = await bcrypt.hash(contrasena, 10);
  console.log(`[RegistrarUsuario] Contraseña hasheada para ${correo}.`);

  const jwtSecretForEmail = process.env.JWT_SECRET;
  if (!jwtSecretForEmail) {
    console.error("[RegistrarUsuario] ERROR: JWT_SECRET no está definido en las variables de entorno para el token de verificación.");
    throw new Error("Error de configuración del servidor: JWT_SECRET no definido.");
  }
  const token = jwt.sign({ correo }, jwtSecretForEmail, { expiresIn: '10m' });
  console.log(`[RegistrarUsuario] Token de verificación generado para ${correo}: ${token}`);

  console.log(`[RegistrarUsuario] Llamando a enviarCorreoVerificacion para ${correo}...`);
  try {
    await enviarCorreoVerificacion(correo, token);
    console.log(`[RegistrarUsuario] enviarCorreoVerificacion completado con éxito para ${correo}.`);
  } catch (emailError: any) {
    console.error(`[RegistrarUsuario] ERROR al llamar a enviarCorreoVerificacion para ${correo}:`, emailError);
    throw new Error(`Fallo al enviar correo de verificación: ${emailError.message || emailError}`);
  }

  await prisma.usuario.create({
    data: {
      Nombre: nickname,
      Correo: correo,
      Password: hash,
      Pais: pais,
      Foto: null,
      Admin: false,
      Verificado: false,
      Token: token
    }
  });
  console.log(`[RegistrarUsuario] Usuario ${correo} creado en la base de datos.`);

  return { mensaje: 'Correo de verificación enviado. Revisa tu bandeja.' };
};

export const iniciarSesion = async (correoONickname: string, contrasena: string) => {
  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { Correo: correoONickname },
        { Nombre: correoONickname },
      ],
    },
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const match = await bcrypt.compare(contrasena, usuario.Password);
  if (!match) {
    throw new Error('Contraseña incorrecta');
  }

  if (!usuario.Verificado) {
    throw new Error('Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.');
  }

  if (process.env.DEBUG) {
    console.log('🔍 [iniciarSesion] Usuario encontrado:', {
      UsuarioID: usuario.UsuarioID,
      Admin: usuario.Admin,
      Verificado: usuario.Verificado
    });
  }

  const token = jwt.sign(
    { 

      UsuarioID: usuario.UsuarioID,  // ✅ CAMBIAR: de 'userId' a 'UsuarioID'
      Admin: usuario.Admin           // ✅ Este está bien

    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  console.log('🎟️ [iniciarSesion] Token generado con payload:', {
    UsuarioID: usuario.UsuarioID,
    Admin: usuario.Admin
  });

  return { token, usuario };
};

export const obtenerUsuarios = () => prisma.usuario.findMany();

export const actualizarUsuario = (id: number, data: any) => {
  return prisma.usuario.update({
    where: { UsuarioID: id },
    data: data,
  });
};

export const eliminarUsuario = (id: number) =>
  prisma.usuario.delete({ where: { UsuarioID: id } });

export const verificarTokenYCuenta = async (token: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("[verificarTokenYCuenta] ERROR: JWT_SECRET no está definido en las variables de entorno.");
    throw new Error("Error de configuración del servidor: JWT_SECRET no definido.");
  }

  try {
    const decoded: any = jwt.verify(token, jwtSecret);
    const correoVerificado = decoded.correo;

    const usuario = await prisma.usuario.findUnique({
      where: { Correo: correoVerificado },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado para el token proporcionado o correo no existe.');
    }

    if (usuario.Verificado) {
      console.log(`[verificarTokenYCuenta] Usuario ${correoVerificado} ya estaba verificado.`);
      return { mensaje: 'Tu cuenta ya había sido verificada.' };
    }

    await prisma.usuario.update({
      where: { UsuarioID: usuario.UsuarioID },
      data: {
        Verificado: true,
        Token: null
      },
    });

    console.log(`[verificarTokenYCuenta] Usuario ${correoVerificado} verificado exitosamente en la base de datos.`);
    return { mensaje: '¡Tu cuenta ha sido verificada con éxito!.' };

  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.error(`[verificarTokenYCuenta] Token expirado:`, error);
      throw new Error('El enlace de verificación ha expirado. Por favor, inicia sesión para solicitar un nuevo enlace.');
    }
    if (error.name === 'JsonWebTokenError') {
      console.error(`[verificarTokenYCuenta] Token inválido:`, error);
      throw new Error('El enlace de verificación es inválido o ha sido manipulado.');
    }
    console.error(`[verificarTokenYCuenta] Error inesperado en verificación:`, error);
    throw new Error(`Error al verificar la cuenta: ${error.message || 'Error desconocido'}`);
  }
};

