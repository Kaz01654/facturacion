import path from 'node:path'
import { getClients, getClientById, createClient, updateClient, deleteClient } from '../controllers/clientes.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getClients`, getClients)
    router.get(`/${filename}/getClients/:id`, getClientById)
    router.post(`/${filename}/insertClient`, createClient)
    router.put(`/${filename}/updateClient/:id`, updateClient)
    router.delete(`/${filename}/deleteClient/:id`, deleteClient)
    return router
}