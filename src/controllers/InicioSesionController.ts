// src/controllers/InicioSesionController.ts
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const registrarUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, correo, password } = req.body;

        if (!nombre || !correo || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // CORRECCIÓN AQUÍ: Cambia findUnique a findFirst
        const usuarioExistente = await prisma.usuario.findFirst({
            where: { Correo: correo },
        });

        if (usuarioExistente) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                Nombre: nombre,
                Correo: correo,
                Password: hashedPassword,
                Estado: 1,
                Token: '',
            },
            select: {
                UsuarioID: true,
                Nombre: true,
                Correo: true,
                Estado: true,
            }
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: nuevoUsuario });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al intentar registrar el usuario.' });
    }
};