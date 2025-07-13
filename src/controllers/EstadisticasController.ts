import { Router, Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"
const prisma = new PrismaClient()
const router = Router()

const EstadisticasController = () => {


    router.get("/total-usuarios", async (req: Request, resp: Response) => {
        try {
            const usuarioId = req.headers["usuario-id"]
            if (!usuarioId) {
                resp.status(400).json({ msg: "Debe enviar el ID de usuario" })
                return
            }

            const usuario = await prisma.usuario.findUnique({
                where: { UsuarioID: parseInt(usuarioId.toString()) }
            })

            if (!usuario?.esAdmin) {
                resp.status(403).json({ msg: "Acceso denegado: solo administradores" })
                return
            }


            const total = await prisma.usuario.count()

            resp.json({
                totalUsuarios: total
            })
        } catch (error) {
            console.error("Error al contar usuarios:", error)
            resp.status(500).json({ msg: "No se pudo obtener el total de usuarios" })
        }
    })


    router.get("/ventas-por-mes", async (req: Request, resp: Response) => {
        try {
            const usuarioId = req.headers["usuario-id"]
            if (!usuarioId) {
                resp.status(400).json({ msg: "Debe enviar el ID de usuario" })
                return
            }

            const usuario = await prisma.usuario.findUnique({
                where: { UsuarioID: parseInt(usuarioId.toString()) }
            })

            if (!usuario?.esAdmin) {
                resp.status(403).json({ msg: "Acceso denegado: solo administradores" })
                return
            }

            const añoActual = new Date().getFullYear()
            const totalesPorMes: number[] = []

            for (let mes = 0; mes < 12; mes++) {
                const ventas = await prisma.venta.findMany({
                    where: {
                        fecha: {
                            gte: new Date(añoActual, mes, 1),
                            lt: new Date(añoActual, mes + 1, 1)
                        }
                    }
                })

                const total = ventas.reduce((sum: number, venta: Venta) =>
                    sum + venta.MontoPagado, 0)
                totalesPorMes.push(Number(total.toFixed(2)))
            }

            resp.json({ año: añoActual, totales: totalesPorMes })
        } catch (error) {
            console.error("Error en /ventas-por-mes:", error)
            resp.status(500).json({ msg: "Error al calcular estadísticas" })
        }
    })




    router.get("/ventas-hoy", async (req: Request, resp: Response) => {
        try {
            const usuarioId = req.headers["usuario-id"]
            if (!usuarioId) {
                resp.status(400).json({ msg: "Debe enviar el ID de usuario" })
                return
            }

            const usuario = await prisma.usuario.findUnique({
                where: { UsuarioID: parseInt(usuarioId.toString()) }
            })

            if (!usuario?.esAdmin) {
                resp.status(403).json({ msg: "Acceso denegado: solo administradores" })
                return
            }

            const hoy = new Date()
            const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
            const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1)

            const inicioAyer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1)
            const finAyer = inicioHoy

            const [ventasHoy, ventasAyer] = await Promise.all([
                prisma.venta.findMany({
                    where: { fecha: { gte: inicioHoy, lt: finHoy } }
                }),
                prisma.venta.findMany({
                    where: { fecha: { gte: inicioAyer, lt: finAyer } }
                })
            ])

            const totalHoy = ventasHoy.reduce((s: number, v: Venta) => s + v.MontoPagado, 0)
            const totalAyer = ventasAyer.reduce((s: number, v: Venta) => s + v.MontoPagado, 0)

            const crecimiento = totalAyer === 0 ? 100 : ((totalHoy - totalAyer) / totalAyer) * 100

            resp.json({
                total: Number(totalHoy.toFixed(2)),
                crecimiento: Number(crecimiento.toFixed(2)),
                cantidadVentas: ventasHoy.length
            })
        } catch (error) {
            console.error("Error en /ventas-hoy:", error)
            resp.status(500).json({ msg: "No se pudo calcular ventas del día" })
        }
    })

}



export default EstadisticasController
