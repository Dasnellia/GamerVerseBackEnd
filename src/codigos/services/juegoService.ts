import prisma from '../../prisma/client';

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
      nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      precio: {
        gte: precioMin ?? undefined,
        lte: precioMax ?? undefined,
      },
      plataformas: plataforma ? { has: plataforma } : undefined,
    },
  });
};

export const obtenerTodos = () => prisma.juego.findMany();

export const obtenerPorId = (id: number) => {
  return prisma.juego.findUnique({ where: { id } });
};

export const crearJuego = (data: any) => {
  return prisma.juego.create({ data });
};

export const actualizarJuego = (id: number, data: any) => {
  return prisma.juego.update({ where: { id }, data });
};

export const eliminarJuego = (id: number) => {
  return prisma.juego.delete({ where: { id } });
};

export const filtrarJuegos = async (
  nombre?: string,
  categoria?: string,
  plataforma?: string
) => {
  return prisma.juego.findMany({
    where: {
      nombre: nombre ? { contains: nombre, mode: 'insensitive' } : undefined,
      categoria: categoria ? categoria : undefined,
      plataformas: plataforma ? { has: plataforma } : undefined,
    },
  });
};
