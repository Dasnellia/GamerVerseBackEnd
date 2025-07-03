import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { PrismaClient } from "../generated/prisma";
<<<<<<< HEAD
import { env } from 'process';

const prisma = new PrismaClient();

// const JWT_SECRET = process.env.JWT_SECRET || 'token'; // Ya no es necesaria si usas process.env directamente
=======

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'token';
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d

import { enviarCorreoVerificacion } from './emailService';

export const registrarUsuario = async (data: any) => {
  const { nickname, correo, contrasena, pais } = data;

<<<<<<< HEAD
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
=======
  const existeCorreo = await prisma.usuario.findUnique({ where: { Correo: correo } });
  if (existeCorreo) throw new Error('El correo ya está registrado.');

  const hash = await bcrypt.hash(contrasena, 10);
  const token = jwt.sign({ correo }, process.env.JWT_SECRET!, { expiresIn: '10m' });

  // ENVÍA CORREO
  await enviarCorreoVerificacion(correo, token);

  // NO lo guardes aún hasta que confirme (esto es opcional según cómo desees validar)
    await prisma.usuario.create({
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
    data: {
      Nombre: nickname,
      Correo: correo,
      Password: hash,
      Pais: pais,
<<<<<<< HEAD
      Foto: null,
=======
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
      Admin: false,
      Verificado: false,
      Token: token
    }
  });
<<<<<<< HEAD
  console.log(`[RegistrarUsuario] Usuario ${correo} creado en la base de datos.`);
=======
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d

  return { mensaje: 'Correo de verificación enviado. Revisa tu bandeja.' };
};

<<<<<<< HEAD
export const iniciarSesion = async (correoONickname: string, contrasena: string) => {
  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { Correo: correoONickname },
        { Nombre: correoONickname },
      ],
    },
  });
=======

export const iniciarSesion = async (correoONickname: string, contrasena: string) => {
  const esCorreo = correoONickname.includes('@');
  const whereClause = esCorreo ? { Correo: correoONickname } : { Nombre: correoONickname };

    // Cambiar findUnique por findFirst
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { Correo: correoONickname },
          { Nombre: correoONickname },
        ],
      },
    });
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const match = await bcrypt.compare(contrasena, usuario.Password);
  if (!match) {
    throw new Error('Contraseña incorrecta');
  }

<<<<<<< HEAD
=======
  // 👇 Verificación del correo
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
  if (!usuario.Verificado) {
    throw new Error('Tu cuenta aún no ha sido verificada. Revisa tu correo electrónico.');
  }

  const token = jwt.sign(
<<<<<<< HEAD
    { 
      userId: usuario.UsuarioID, 
      rol: usuario.Admin ? 'ADMIN' : 'USER' 
    },
=======
    { id: usuario.UsuarioID, tipo: usuario.Admin },
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return { token, usuario };
};
<<<<<<< HEAD

export const obtenerUsuarios = () => prisma.usuario.findMany();

// --- ¡CORRECCIÓN CLAVE AQUÍ! ---
// La función actualizarUsuario ahora acepta un objeto 'data' genérico
// que puede contener cualquier campo del modelo Usuario.
export const actualizarUsuario = (id: number, data: any) => {
  // Antes:
  // const nombreCompleto = `${data.nombre} ${data.apellidos}`;
  // return prisma.usuario.update({
  //   where: { UsuarioID: id },
  //   data: {
  //     Nombre: nombreCompleto,
  //     Correo: data.correoElectronico,
  //   }
  // });

  // Ahora, simplemente pasamos el objeto 'data' directamente a Prisma.
  // Prisma se encargará de actualizar solo los campos presentes en 'data'.
  return prisma.usuario.update({
    where: { UsuarioID: id },
    data: data, // ¡Esto permite actualizar cualquier campo, incluido 'Verificado'!
  });
};
=======
export const obtenerUsuarios = () => prisma.usuario.findMany();

export const actualizarUsuario = (id: number, data: any) =>
  prisma.usuario.update({
    where: { UsuarioID: id },
    data,
  });
>>>>>>> ad084610cd1ed3b5398396181204518fc7af5e0d

export const eliminarUsuario = (id: number) =>
  prisma.usuario.delete({ where: { UsuarioID: id } });
