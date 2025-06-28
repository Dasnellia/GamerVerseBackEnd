import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const obtenerJuegosPorIds = async (carritoItems: any[]) => {
  const juegoIds = carritoItems.map(item => item.juegoId);

  // Obtener los juegos usando los IDs del carrito
  const juegos = await prisma.juego.findMany({
    where: {
      JuegoID: {
        in: juegoIds
      }
    }
  });

  return juegos.map((juego: { Nombre: string; JuegoID: number; }) => ({
    nombre: juego.Nombre,
    clave: juego.JuegoID.toString()
  }));
};

export const calcularTotal = async (carritoItems: any[]) => {
  // Calcular el total del carrito
  let total = 0;
  for (const item of carritoItems) {
    const juego = await prisma.juego.findUnique({ where: { JuegoID: item.juegoId } });
    if (juego) total += juego.Precio * item.cantidad;
  }
  return total;
};

export const realizarPago = async (usuarioId: number, totalPago: number) => {
  return true;  // Supongo que siempre se da bien el pago???
};

export const registrarVenta = async (usuarioId: number, carritoItems: any[], totalPago: number) => {
  // Registrar la venta en la base de datos
  await prisma.venta.create({
    data: {
      VentaID: 0,
      Usuario_UsuarioID: usuarioId,
      MontoPagado: totalPago,
      Fecha: new Date(),
      Juego_JuegoID: carritoItems[0]?.juegoId || 0,
      Juego_CategoriaID: 1,
      Codigo: "CODIGO_qUE_VAS_a_GENERAR_POR_aHI"
    },
  });
};
