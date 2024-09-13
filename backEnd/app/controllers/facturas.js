import { conexionDBPGP } from '../db/dbConfig.js'
import { handleHttpError } from '../utils/handleError.js'

export const getFacturas = async(req, resp) => {
    try {
        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`SELECT * FROM facturacion ORDER BY id_fact ASC`,
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

export const getFacturaById = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`SELECT * FROM facturacion WHERE id_fact = $1`, [id]
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

export const createFactura = async(req, resp) => {
    try {
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`INSERT INTO facturacion (cliente_fact, total_fact, items_fact) VALUES ($1, $2, $3) RETURNING *`,
                    [object.cliente_fact, object.total_fact, object.items_fact]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Factura agregada exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const updateFactura = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`UPDATE facturacion SET cliente_fact = $2, total_fact = $3, items_fact = $4 WHERE id_fact = $1`,
                    [id, object.cliente_fact, object.total_fact, object.items_fact]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Factura actualizada exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const deleteFactura = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`DELETE FROM facturacion WHERE id_fact = $1 RETURNING *`,  [id]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `La Factura del cliente: ${res[0].cliente_fact} fue eliminada exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}