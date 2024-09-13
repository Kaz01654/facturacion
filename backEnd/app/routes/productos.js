import path from 'node:path'
import { getProducts, getProductById, createProduct, updateProduct, prodControl, deleteProduct } from '../controllers/productos.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getProducts`, getProducts)
    router.get(`/${filename}/getProducts/:id`, getProductById)
    router.post(`/${filename}/insertProd`, createProduct)
    router.put(`/${filename}/updateProd/:id`, updateProduct)
    router.put(`/${filename}/updateProdCont/:id`, prodControl)
    router.delete(`/${filename}/deleteProd/:id`, deleteProduct)
    return router
}