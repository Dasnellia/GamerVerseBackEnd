import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const obtenerTotalUsuarios = async (_req: Request, res: Response): Promise<void> => {
  try {
    const total = await prisma.usuario.count({
      where: {
        Admin: false, // Excluir administradores
      }
    });
    
    res.json({ total });
  } catch (error) {
    console.error("Error al contar usuarios:", error);
    res.status(500).json({ msg: "No se pudo obtener el total de usuarios" });
  }
};

export const obtenerVentasPorMes = async (req: Request, res: Response): Promise<void> => {
  try {
  

    const añoActual = new Date().getFullYear();
    const totalesPorMes = [];

    for (let mes = 0; mes < 12; mes++) {
      const ventas = await prisma.venta.findMany({
        where: {
          Fecha: {
            gte: new Date(añoActual, mes, 1),
            lt: new Date(añoActual, mes + 1, 1),
          },
        },
      });

      const total = ventas.reduce((sum: number, venta: { MontoPagado: number }) => sum + venta.MontoPagado, 0);
      totalesPorMes.push(Number(total.toFixed(2)));
    }

    res.json({ totalesPorMes });
  } catch (error) {
    console.error("Error en /ventas-por-mes:", error);
    res.status(500).json({ msg: "Error al calcular estadísticas" });
  }
};

export const obtenerVentasHoy = async (req: Request, res: Response): Promise<void> => {
  try {
    

    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

    const inicioAyer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1);
    const finAyer = inicioHoy;

    const [ventasHoy, ventasAyer] = await Promise.all([
      prisma.venta.findMany({ where: { Fecha: { gte: inicioHoy, lt: finHoy } } }),
      prisma.venta.findMany({ where: { Fecha: { gte: inicioAyer, lt: finAyer } } }),
    ]);

    const totalHoy = ventasHoy.reduce((s: number, v: { MontoPagado: number }) => s + v.MontoPagado, 0);
    const totalAyer = ventasAyer.reduce((s: number, v: { MontoPagado: number }) => s + v.MontoPagado, 0);

    const crecimiento = totalAyer === 0 ? 100 : ((totalHoy - totalAyer) / totalAyer) * 100;

    res.json({ 
      totalHoy: Number(totalHoy.toFixed(2)),
      totalAyer: Number(totalAyer.toFixed(2)),
      crecimiento: Number(crecimiento.toFixed(2)),
      cantidadVentas: ventasHoy.length
    });
  } catch (error) {
    console.error("Error en /ventas-hoy:", error);
    res.status(500).json({ msg: "No se pudo calcular ventas del día" });
  }
};