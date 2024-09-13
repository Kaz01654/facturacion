import { conexionDBPGP } from '../db/dbConfig.js'
import { handleHttpError } from '../utils/handleError.js'

export const getProducts = async(req, resp) => {
    try {
        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`SELECT * FROM PRODUCTOS P INNER JOIN IMPUESTO I ON P.imp_prod = I.id ORDER BY id_prod ASC`,
            )
        }).then(res => {
            resp.status(200).json(res)
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const getProductById = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`SELECT * FROM productos WHERE id_prod = $1`, [id]
            )
        }).then(res => {
            resp.status(200).json(res)
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const createProduct = async(req, resp) => {
    try {
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`INSERT INTO productos (nombre_prod, cant_prod, precio_prod, imp_prod, ganancia_prod) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [object.nombre_prod, object.cant_prod, object.precio_prod, object.imp_prod, object.ganancia_prod]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Producto agregado exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const updateProduct = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`UPDATE productos SET nombre_prod = $2, cant_prod = $3, precio_prod = $4, imp_prod = $5, ganancia_prod = $6 WHERE id_prod = $1`,
                    [id, object.nombre_prod, object.cant_prod, object.precio_prod, object.imp_prod, object.ganancia_prod]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Producto actualizado exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const prodControl = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { cant } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`UPDATE productos SET cant_prod = $2 WHERE id_prod = $1`,  [id, cant]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `Producto actualizado exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const deleteProduct = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`DELETE FROM productos WHERE id_prod = $1 RETURNING *`,  [id]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `El Producto ${res[0].nombre_prod} fue eliminado exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}