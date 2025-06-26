import { Router, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { Venta } from "../models/data"

const prisma = new PrismaClient()

const VentasController = () => {
    const router = Router()

    // Obtener todas las ventas
    // Puedes filtrar por estado usando el query parameter ?estado=valor
    // Ejemplo: GET /ventas?estado=COMPLETADA
    // Si no se especifica estado, devuelve todas las ventas
    // El header "usuario-id" no se usa en este endpoint, pero lo puedes usar
    router.get("/", async (req: Request, resp: Response) => {
        const usuarioId = req.headers["usuario-id"]

        if (usuarioId == undefined) {
            resp.status(400).json({
                msg: "Envia codigo de usuario chistoso"
            })
            return
        }
        const ventas = await prisma.todo.findMany({
            relationLoadStrategy: 'join',
            //esto es una consulta que busca todas las ventas de un usuario especifico
            //piensenlo como si fuera unna consulta sql
            //esto tipo hara que solo aparezcan las ventas del usuario que envio el header "usuario-id"
            where: {
                usuarioId: parseInt(usuarioId.toString())
            },
            include: {
                usuario: true,
                juego: {
                    include: {
                        nombre: true,
                        categoria: true,
                        plataformas: true
                    }
                }
            }
        })

        resp.json(ventas)
    })

    // Obtener una venta por ID
    router.get("/:id", async (req: Request, resp: Response) => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            resp.status(400).json({ msg: "ID inválido" })
            return
        }

        const venta = await prisma.venta.findUnique({
            where: { id: id }
        })

        if (venta == null) {
            resp.status(404).json({ msg: "Venta no encontrada" })
        }

        resp.json(venta)
    })

    // Crear una nueva venta
    router.post("/", async (req: Request, resp: Response) => {
        const data = req.body

        // Valida los campos requeridos según tu modelo, si falta cualquiera de ellos, devuelve un error 400
        //todos son obligatorios, si quieres que alguno sea opcional, puedes quitarlo de la validacion
        if (data.Usuario_UsuarioID == undefined || data.Juego_JuegoID == undefined || data.Juego_CategoriaID == undefined || data.Fecha == undefined || data.Codigo == undefined || data.MontoPagado == undefined) {
            resp.status(400).json({ msg: "Faltan campos obligatorios" })
            return
        }

        try {
            const ventaCreada = await prisma.venta.create({ data })
            resp.json({ msg: "", venta: ventaCreada })
        } catch (e) {
            resp.status(400).json({ msg: "Error al crear la venta", error: e })
        }
    })

    // Eliminar una venta segun id 
    // Elimina una venta por ID
    // Si no existe, devuelve un error 404
    router.delete("/:id", async (req: Request, resp: Response) => {
        const id = parseInt(req.params.id)

        if (id == undefined || isNaN(id)) {
            resp.status(400).json({ msg: "ID inválido" })
            return
        }

        try {
            await prisma.venta.delete({
                where: { id: id }
            })
            resp.json({ msg: "" })
        } catch (e) {
            resp.status(404).json({ msg: "No existe Venta con ese id" })
            return
        }
    })


    router.get("/total-ventas-mes", async (req: Request, resp: Response) => {
        try {
            //aca saca el id del usuario que envia la peticion
            const usuarioId = req.headers["usuario-id"]
            if (!usuarioId) {
                resp.status(400).json({
                    msg: "Debe enviar el ID de usuario"
                })
                return
            }

            // aca verifica si el usuario es administrador, pero no tipo viendo la base de datos, sino viendo el header que envia el usuario
            // si el header "admin" es true, entonces el usuario es administrador, sino no
            //para hacer que envie ese header si es administrador, voy a cambiar el login para que envie ese header si el usuario es administrador
            const isAdmin = req.headers["admin"] === "true"
            if (isAdmin === undefined) {
                resp.status(400).json({
                    msg: "Debe especificar si el usuario es administrador (header 'admin': true/false)"
                })
                return
            }

            // aca si es full base de datos,m se obtiennen todos las ventas
            //que hago si el mes q quiero es el mes del día de hoy?

            const mes = req.query.mes ? parseInt(req.query.mes.toString()) : null
            // Validar q el mes pedido sea valida p, no como el mes 13 o 0
            if (mes && (mes < 1 || mes > 12)) {
                resp.status(400).json({
                    msg: "El mes debe ser un valor entre 1 y 12"
                })
                return
            }

            // construye la fecha, gte inico de mes y lt inicio del siguiente mes
            const dateFilter = mes ? {
                fecha: {
                    gte: new Date(new Date().getFullYear(), mes - 1, 1),
                    lt: new Date(new Date().getFullYear(), mes, 1)
                }
            } : {}


            const ventas = await prisma.venta.findMany({
                where: {
                    ...dateFilter
                },
                include: {
                    MontoPagado: true,
                    fecha: true
                }
            })

            const total = ventas.reduce((sum: number, venta: Venta) => {
                return sum + parseFloat(venta.MontoPagado)
            }, 0)


            resp.json({ total: Number(total.toFixed(2)) })
        } catch (error) {
            console.error("Error en /total-ventas-mes:", error)
            resp.status(500).json({ msg: "Error interno al obtener las ventas" })
        }

    })

    


}


export default VentasController