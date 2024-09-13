import path from 'node:path'
import { getImpuesto, createImpuesto, updateImpuesto, deleteImpuesto } from '../controllers/impuesto.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getImpuesto`, getImpuesto)
    router.post(`/${filename}/insertImp`, createImpuesto)
    router.put(`/${filename}/updateImp/:id`, updateImpuesto)
    router.delete(`/${filename}/deleteImp/:id`, deleteImpuesto)
    return router
}