import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                UsuarioID: true,
                Nombre: true,
                Correo: true,
                Foto: true, 
                Admin: true,
                Verificado: true, 
            },
        });
        return usuarios;
    } catch (error) {
        console.error("Error en ListadoUsuarioService.getAllUsers:", error);
        throw new Error("No se pudo obtener la lista de usuarios.");
    }
};