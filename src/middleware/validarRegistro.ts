import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const validarRegistro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nickname, correo, contrasena, confirmarContrasena, pais } = req.body;
  const errores: string[] = [];

  // 1. Validación de campos requeridos
  if (!nickname || !correo || !contrasena || !confirmarContrasena || !pais) {
    errores.push('Todos los campos obligatorios deben estar completos.');
  }

  // 2. Validaciones individuales
  if (correo && !correo.includes('@')) {
    errores.push('El correo debe tener un formato válido.');
  }

  if (contrasena && contrasena.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }

  if (contrasena !== confirmarContrasena) {
    errores.push('Las contraseñas no coinciden.');
  }

  // 3. Solo consultar la BD si no hay errores previos
  if (errores.length === 0) {
    const [existeNickname, existeCorreo] = await Promise.all([
      prisma.usuario.findFirst({ where: { Nombre: nickname } }), // Cambiado a findFirst
      prisma.usuario.findUnique({ where: { Correo: correo } }) // Correo sigue siendo único
    ]);

    if (existeNickname) errores.push('El nickname ya está en uso.');
    if (existeCorreo) errores.push('El correo ya está registrado.');
  }

  // 4. Retornar errores si existen
  if (errores.length > 0) {
    console.log('Errores desde backend:', errores);
    res.status(400).json({ errores });
    return;
  }

  // 5. Continuar al siguiente middleware
  next();
};