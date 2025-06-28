import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

interface FiltroJuego {
  nombre?: string;
  plataforma?: string;
  precioMin?: number;
  precioMax?: number;
}

export const filtrarConLogica = async (filtros: FiltroJuego) => {
  const { nombre, plataforma, precioMin, precioMax } = filtros;

  return prisma.juego.findMany({
    where: {
      Nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      Precio: {
        gte: precioMin ?? undefined,
        lte: precioMax ?? undefined,
      },
      Plataformas: plataforma
        ? {
            some: {
              Plataforma: {
                Nombre: { contains: plataforma, mode: 'insensitive' },
              },
            },
          }
        : undefined,
    },
  });
};

export const obtenerTodos = () => prisma.juego.findMany();

export const obtenerPorId = (id: number) => {
  return prisma.juego.findUnique({ where: { JuegoID: id } });
};

export const crearJuego = (data: any) => {
  return prisma.juego.create({ data });
};

export const actualizarJuego = (id: number, data: any) => {
  return prisma.juego.update({ where: { JuegoID: id }, data });
};

export const eliminarJuego = (id: number) => {
  return prisma.juego.delete({ where: { JuegoID: id } });
};

export const filtrarJuegos = async (
  nombre?: string,
  categoria?: number,
  plataforma?: string
) => {
  return prisma.juego.findMany({
    where: {
      Nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      Categoria_CategoriaID: categoria ?? undefined,
      Plataformas: plataforma
        ? {
            some: {
              Plataforma: {
                Nombre: { contains: plataforma, mode: 'insensitive' },
              },
            },
          }
        : undefined,
    },
  });
};