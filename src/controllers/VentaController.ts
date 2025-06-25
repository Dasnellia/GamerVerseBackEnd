import express, { Request, Response } from "express"
import { PrismaClient } from '../generated/prisma'


const VentasController = () => {
    const router = express.Router()

    router.get("/", async (req : Request, resp : Response) => {
        const prisma = new PrismaClient()
    
        const estado = req.query.estado
    
        if (estado == undefined) {
            
            const Ventas = await prisma.venta.findMany()
            resp.json(Ventas)
            return
        }
    
        
        resp.json(Ventas)
    })
    
    router.get("/:id", async (req : Request, resp : Response) => {
        const prisma = new PrismaClient()
        const id = parseInt(req.params.id)
    
        const Venta = await prisma.venta.findUnique({
            where : {
                VentaID : id
            }
        })
    
        if (Venta == null) {
            // Error: no se encontro
            resp.status(400).json({
                msg : "Codigo incorrecto"
            })
        }
    
        resp.json(Venta)
    })
    

    router.post("/", async (req : Request, resp : Response) => {
        const prisma = new PrismaClient()
        const Venta = req.body
    
        if (Venta.descripcion == undefined)
        {
            resp.status(400).json({
                msg : "Debe enviar campo"
            })
            return
        }
    
        const VentaCreado = await prisma.venta.create({
            data : Venta
        })
    
        resp.json({
            msg : "",
            Venta : VentaCreado
        })
    })
    
    router.put("/:id", async (req : Request, resp : Response) => {
        const prisma = new PrismaClient()
        const Venta = req.body
        const VentaId = parseInt(req.params.id)
    
        if (VentaId == undefined)
        {
            resp.status(400).json({
                msg : "Debe enviar un id como parte del path"
            })
            return
        }
    
        try {
            const VentaModificado = await prisma.venta.update({
                where : {
                    VentaId : VentaId
                },
                data : Venta
            })
            resp.json({
                msg : "",
                Venta : VentaModificado
            })
        }catch( e ) {
            resp.status(400).json({
                msg : "No existe Venta con ese id"
            })
        }
    })
    
    router.delete("/:id", async (req : Request, resp : Response) => {
        const prisma = new PrismaClient()
        const VentaId = parseInt(req.params.id)
    
        if (VentaId == undefined) {
            resp.status(400).json({
                msg : "Debe enviar un ID de Venta."
            })
            return
        }
    
        try {
            await prisma.venta.delete({
                where : {
                    VentaId : VentaId
                }
            })
            resp.json({
                msg : ""
            })
        }catch (e) {
            resp.status(400).json({
                msg : "No existe Venta con ese id"
            })
            return
        }
    })

    return router
}

export default VentasController