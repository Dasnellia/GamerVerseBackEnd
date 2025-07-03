import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

//  Obtiene todos los ítems del carrito del usuario.
export const getCarritoItems = async (usuarioID: number) => {
  try {
    const carritoItems = await prisma.carritoItem.findMany({
      where: { UsuarioID: usuarioID },
      include: {
        Juego: {
          select: {
            JuegoID: true,
            Nombre: true,
            Precio: true,
            Imagen: true,
            Stock: true,
          },
        },
      },
    });

    const itemsFormateados = carritoItems.map(item => ({
      id: item.Juego.JuegoID,
      nombre: item.Juego.Nombre,
      precio: parseFloat(item.Juego.Precio.toString()),
      cantidad: item.Cantidad,
      imagen: item.Juego.Imagen,
      stockDisponible: item.Juego.Stock,
    }));

    const subtotal = itemsFormateados.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);

    return {
      items: itemsFormateados,
      subtotal: parseFloat(subtotal.toFixed(2)),
    };
  } catch (error: any) {
    console.error("Error en getCarritoItems:", error);
    throw new Error("No se pudo obtener el carrito.");
  }
};

// Agrega o Actualiza un Item del Carrito
export const addUpCarritoItem = async (usuarioID: number, juegoId: number, cantidad: number) => {
  try {
    const juegoExistente = await prisma.juego.findUnique({
      where: { JuegoID: juegoId },
      select: { Stock: true, Nombre: true },
    });

    if (!juegoExistente) {
      throw new Error("Juego no encontrado.");
    }

    const existingItem = await prisma.carritoItem.findUnique({
      where: {
        UsuarioID_JuegoID: {
          UsuarioID: usuarioID,
          JuegoID: juegoId,
        },
      },
    });

    // Validar si la cantidad supera el stock disponible
    if (cantidad > juegoExistente.Stock) {
      throw new Error(`La cantidad solicitada (${cantidad}) excede el stock disponible (${juegoExistente.Stock}) para el juego "${juegoExistente.Nombre}".`);
    }

    if (existingItem) {
      await prisma.carritoItem.update({
        where: { CarritoItemID: existingItem.CarritoItemID },
        data: { Cantidad: cantidad },
      });
    } else {
      await prisma.carritoItem.create({
        data: {
          UsuarioID: usuarioID,
          JuegoID: juegoId,
          Cantidad: cantidad,
        },
      });
    }

    return getCarritoItems(usuarioID);
  } catch (error: any) {
    console.error("Error en addUpCarritoItem:", error);
    throw new Error(error.message || "No se pudo añadir/actualizar el ítem en el carrito.");
  }
};

// Borra Item del Carrito
export const borrarCarritoItem = async (usuarioID: number, juegoID: number) => {
  try {
    const itemToDelete = await prisma.carritoItem.findUnique({
      where: {
        UsuarioID_JuegoID: {
          UsuarioID: usuarioID,
          JuegoID: juegoID,
        },
      },
    });

    if (!itemToDelete) {
      throw new Error("El juego no se encontró en el carrito de este usuario.");
    }

    await prisma.carritoItem.delete({
      where: { CarritoItemID: itemToDelete.CarritoItemID },
    });

    return getCarritoItems(usuarioID);
  } catch (error: any) {
    console.error("Error en borrarCarritoItem:", error);
    throw new Error(error.message || "No se pudo eliminar el ítem del carrito.");
  }
};

// Vaciar el carrito
export const limpiarCarrito = async (usuarioID: number) => {
  try {
    await prisma.carritoItem.deleteMany({
      where: { UsuarioID: usuarioID },
    });
    return { msg: "Carrito vaciado con éxito." };
  } catch (error: any) {
    console.error("Error en limpiarCarrito:", error);
    throw new Error("No se pudo vaciar el carrito.");
  }
};

// =============================================================================
// Funciones para el PagoController 
// ==============================================================================

// Simulación de pago
export const realizarPago = async (usuarioId: number, totalPago: number) => {
  console.log(`Simulando pago de ${totalPago.toFixed(2)} para el usuario ${usuarioId}...`);
  return true;
};

// Registrar la venta (versión adaptada a lo que el compañero esperaba)
export const registrarVenta = async (usuarioId: number, carritoItems: any[], totalPago: number) => {
  if (carritoItems.length === 0) {
    throw new Error("No hay ítems en el carrito para registrar una venta.");
  }

  const codigoVenta = `VENTA-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  await prisma.$transaction(async (tx) => {
    for (const item of carritoItems) {
      const juego = await tx.juego.findUnique({
        where: { JuegoID: item.id },
        select: { Precio: true, Stock: true, Categoria_CategoriaID: true },
      });

      if (!juego) {
        throw new Error(`Juego con ID ${item.id} no encontrado durante el registro de venta.`);
      }

      if (item.cantidad > juego.Stock) {
        throw new Error(`Stock insuficiente para registrar la venta del juego "${item.nombre}".`);
      }

      await tx.venta.create({
        data: {
          Usuario_UsuarioID: usuarioId,
          MontoPagado: totalPago,
          Fecha: new Date(),
          Juego_JuegoID: carritoItems[0]?.juegoId || 0,
          Juego_CategoriaID: 1,
          Codigo: "CODIGO_qUE_VAS_a_GENERAR_POR_aHI"
        },
      });

      await tx.juego.update({
        where: { JuegoID: item.id },
        data: { Stock: { decrement: item.cantidad } },
      });
    }

    await tx.carritoItem.deleteMany({
      where: { UsuarioID: usuarioId },
    });
  });
};

// Obtener detalles de juegos por IDs para el correo
export const obtenerJuegosPorIds = async (carritoItems: any[]) => {
  const juegoIds = carritoItems.map(item => item.juegoId);

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

// Calcular el total del carrito (usando juegoId del carritoItems)
export const calcularTotal = async (carritoItems: any[]) => {
  let total = 0;
  for (const item of carritoItems) {
    const juego = await prisma.juego.findUnique({ where: { JuegoID: item.juegoId } });
    if (juego) total += juego.Precio * item.cantidad;
  }
  return total;
};