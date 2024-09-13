import path from 'node:path'
import { getGastos, getGastosByDate, createGastos, updateGastos, deleteGastos } from '../controllers/gastos.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getGastos`, getGastos)
    router.get(`/${filename}/getGastosByDate/:fecha`, getGastosByDate)
    router.post(`/${filename}/insertGasto`, createGastos)
    router.put(`/${filename}/updateGasto/:id`, updateGastos)
    router.delete(`/${filename}/deleteGasto/:id`, deleteGastos)
    return router
}