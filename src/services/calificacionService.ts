import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Obtener las calificaciones de los juegos (si es necesario)
export const obtenerCalificacionesPorJuego = async (juegoId: number) => {
  return prisma.calificacion.findMany({
    where: {
      Juego_JuegoID: juegoId,
    },
  });
};

// Calcular el promedio de las calificaciones para un juego
export const calcularPromedioCalificaciones = async (juegoId: number) => {
  const calificaciones = await obtenerCalificacionesPorJuego(juegoId);
  const total = calificaciones.reduce((acc, cal) => acc + cal.CalificacionID, 0);
  return total / calificaciones.length || 0;  // Retorna el promedio, si no hay calificaciones retorna 0
};