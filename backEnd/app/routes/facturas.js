import path from 'node:path'
import { getFacturas, getFacturasByDate, getFacturaById, createFactura, updateFactura, deleteFactura } from '../controllers/facturas.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getFacturas`, getFacturas)
    router.get(`/${filename}/getFacturasByDate/:fecha`, getFacturasByDate)
    router.get(`/${filename}/getFacturas/:id`, getFacturaById)
    router.post(`/${filename}/insertFactura`, createFactura)
    router.put(`/${filename}/updateFactura/:id`, updateFactura)
    router.delete(`/${filename}/deleteFactura/:id`, deleteFactura)
    return router
}