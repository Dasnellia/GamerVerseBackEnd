import { Request, Response, NextFunction } from 'express'; 
import * as noticiaService from '../services/noticiaService';

interface AuthenticatedRequest extends Request {
    user?: {
        UsuarioID: number;
        Admin: boolean;
    };
}

export const authenticateAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const isAdmin = req.user?.Admin;

    if (!isAdmin) { 
        res.status(403).json({ msg: "Acceso denegado: Se requiere rol de administrador." });
        return;
    }
    next();
};


// GET: Obtener todas las noticias 
export const getAllNoticias = async (req: Request, res: Response) => {
    try {
        const noticias = await noticiaService.getAllNoticias();
        res.json(noticias);
    } catch (error: any) {
        console.error("Error al obtener las noticias en el controlador:", error);
        res.status(500).json({ msg: "Error interno del servidor al obtener las noticias." });
    }
};

// GET: Obtener una noticia por ID 
export const getNoticiaById = async (req: Request, res: Response) => {
    const noticiaID = parseInt(req.params.id);

    if (isNaN(noticiaID)) {
        res.status(400).json({ msg: "ID de noticia inválido." });
        return;
    }

    try {
        const noticia = await noticiaService.obtenerNoticia(noticiaID);

        if (!noticia) {
            res.status(404).json({ msg: "Noticia no encontrada." });
            return;
        }

        res.json(noticia);
    } catch (error: any) {
        console.error("Error al obtener la noticia en el controlador:", error);
        res.status(500).json({ msg: "Error interno del servidor al obtener la noticia." });
    }
};

// POST: Crear una nueva noticia 
export const crearNoticia = async (req: Request, res: Response) => {
    const { Titulo, Descripcion, Foto } = req.body;

    if (!Titulo || !Descripcion) {
        res.status(400).json({ msg: "Faltan campos obligatorios: Titulo, Descripcion." });
        return;
    }

    try {
        const nuevaNoticia = await noticiaService.crearNoticia({ Titulo, Descripcion, Foto });
        res.status(201).json({ msg: "Noticia creada con éxito.", noticia: nuevaNoticia });
    } catch (error: any) {
        console.error("Error al crear la noticia en el controlador:", error);
        res.status(500).json({ msg: "Error interno del servidor al crear la noticia." });
    }
};

// PUT: Actualizar una noticia existente 
export const editarNoticia = async (req: Request, res: Response) => {
    const noticiaID = parseInt(req.params.id);
    const { Titulo, Descripcion, Foto } = req.body;

    if (isNaN(noticiaID)) {
        res.status(400).json({ msg: "ID de noticia inválido." });
        return;
    }

    if (!Titulo || !Descripcion) {
        res.status(400).json({ msg: "Faltan campos obligatorios para la actualización: Titulo, Descripcion." });
        return;
    }

    try {
        const noticiaExistente = await noticiaService.obtenerNoticia(noticiaID);
        if (!noticiaExistente) {
            res.status(404).json({ msg: "Noticia no encontrada para actualizar." });
            return;
        }

        const noticiaActualizada = await noticiaService.editarNoticia(noticiaID, { Titulo, Descripcion, Foto });
        res.status(200).json({ msg: "Noticia actualizada con éxito.", noticia: noticiaActualizada });
    } catch (error: any) {
        console.error("Error al actualizar la noticia en el controlador:", error);
        res.status(500).json({ msg: "Error interno del servidor al actualizar la noticia." });
    }
};

// DELETE: Eliminar una noticia 
export const borrarNoticia = async (req: Request, res: Response) => {
    const noticiaID = parseInt(req.params.id);

    if (isNaN(noticiaID)) {
        res.status(400).json({ msg: "ID de noticia inválido." });
        return;
    }

    try {
        const noticiaExistente = await noticiaService.obtenerNoticia(noticiaID);
        if (!noticiaExistente) {
            res.status(404).json({ msg: "Noticia no encontrada para eliminar." });
            return;
        }

        await noticiaService.borrarNoticia(noticiaID);
        res.status(200).json({ msg: "Noticia eliminada con éxito." });
    } catch (error: any) {
        console.error("Error al eliminar la noticia en el controlador:", error);
        res.status(500).json({ msg: "Error interno del servidor al eliminar la noticia." });
    }
};