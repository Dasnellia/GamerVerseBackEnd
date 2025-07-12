import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Obtiene todas las noticias disponibles.
export const getAllNoticias = async () => {
  try {
    const noticias = await prisma.noticia.findMany({
      select: {
        NoticiaID: true,
        Titulo: true,
        Descripcion: true,
        Foto: true,
      },
    });
    return noticias;
  } catch (error: any) {
    console.error("Error en getAllNoticias:", error);
    throw new Error("No se pudieron obtener las noticias.");
  }
};

// Obtiene una noticia específica por su ID.
export const obtenerNoticia = async (noticiaID: number) => {
  try {
    const noticia = await prisma.noticia.findUnique({
      where: { NoticiaID: noticiaID },
      select: {
        NoticiaID: true,
        Titulo: true,
        Descripcion: true,
        Foto: true,
      },
    });
    return noticia;
  } catch (error: any) {
    console.error("Error en obtenerNoticia:", error);
    throw new Error(`No se pudo obtener la noticia con ID ${noticiaID}.`);
  }
};

// Crea una nueva noticia.
// Foto ahora puede ser string (URL) o null desde el frontend, pero se guardará como string.
export const crearNoticia = async (data: { Titulo: string; Descripcion: string; Foto?: string | null }) => {
  try {
    const nuevaNoticia = await prisma.noticia.create({
      data: {
        Titulo: data.Titulo,
        Descripcion: data.Descripcion,
        Foto: data.Foto || '', 
      },
    });
    return nuevaNoticia;
  } catch (error: any) {
    console.error("Error en crearNoticia:", error);
    throw new Error("No se pudo crear la noticia.");
  }
};

// Actualiza una noticia existente.
export const editarNoticia = async (noticiaID: number, data: { Titulo?: string; Descripcion?: string; Foto?: string | null }) => {
  try {
    const updatePayload: {
      Titulo?: string;
      Descripcion?: string;
      Foto?: string; 
    } = {};

    if (data.Titulo !== undefined) {
      updatePayload.Titulo = data.Titulo;
    }
    if (data.Descripcion !== undefined) {
      updatePayload.Descripcion = data.Descripcion;
    }
    
    if (data.Foto !== undefined) {

      updatePayload.Foto = data.Foto === null ? '' : data.Foto; 

    }

    const noticiaActualizada = await prisma.noticia.update({
      where: { NoticiaID: noticiaID },
      data: updatePayload,
    });
    return noticiaActualizada;
  } catch (error: any) {
    console.error("Error en editarNoticia:", error);
    throw new Error(`No se pudo actualizar la noticia con ID ${noticiaID}.`);
  }
};

// Elimina una noticia por su ID.
export const borrarNoticia = async (noticiaID: number) => {
  try {
    await prisma.noticia.delete({
      where: { NoticiaID: noticiaID },
    });
    return { msg: `Noticia con ID ${noticiaID} eliminada con éxito.` };
  } catch (error: any) {
    console.error("Error en borrarNoticia:", error);
    throw new Error(`No se pudo eliminar la noticia con ID ${noticiaID}.`);
  }
};
