
interface Usuario {
    UsuarioID: number;
    Correo: string;
    Password: string;
    Nombre: string;
    Token: string;
    Estado: number;
    Calificaciones: Calificacion[];
    Ventas: Venta[];
}

interface Juego {
    JuegoID: number;
    Nombre: string;
    Precio: string;
    Oferta: number;
    Estado: number;
    Categoria_CategoriaID: number;
    Categoria: Categoria;
    Calificaciones: Calificacion[];
    Ventas: Venta[];
    Plataformas: Juego_Plataforma[];
}

interface Plataforma {
    PlataformaID: number;
    Nombre: string;
    Juegos: Juego_Plataforma[];
}

interface Calificacion {
    CalificacionID: number;
    Usuario_UsuarioID: number;
    Juego_JuegoID: number;
    Juego_CategoriaID: number;
    Valoracion: string;
    Comentario: string;
    Usuario: Usuario;
    Juego: Juego;
    PK: [ 'CalificacionID', 'Usuario_UsuarioID', 'Juego_JuegoID', 'Juego_CategoriaID' ];
}

interface Venta {
    VentaID: number;
    Usuario_UsuarioID: number;
    Juego_JuegoID: number;
    Juego_CategoriaID: number;
    Fecha: Date;
    Codigo: string;
    MontoPagado: string;
    Usuario: Usuario;
    Juego: Juego;
    PK: [ 'VentaID', 'Usuario_UsuarioID', 'Juego_JuegoID', 'Juego_CategoriaID' ];
}

interface Noticia {
    NoticiaID: number;
    Titulo: string;
    Texto: string;
    Activo: number;
}

interface Juego_Plataforma {
    PlataformaID: number;
    JuegoID: number;
    Plataforma: Plataforma;
    Juego: Juego;
    PK: [ 'PlataformaID', 'JuegoID' ];
}

interface Categoria {
    CategoriaID: number;
    Nombre: string;
}

export {
    Usuario,
    Juego,
    Plataforma,
    Calificacion,
    Venta,
    Noticia,
    Juego_Plataforma,
    Categoria
};
