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

export const getFacturasByDate = async(req, resp) => {
    try {
        const fecha = req.params.fecha

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`SELECT * FROM facturacion where fecha_fact = $1 ORDER BY id_fact ASC`, [fecha])
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
                return t.any(`SELECT COUNT(*)::int as existe FROM clientes WHERE id = $1`, [ object.cliente_fact.id ]
            ).then(res => {
                console.log(res)
                if (res[0].existe > 0) {
                    return true
                } else {
                    return t.any(`INSERT INTO clientes (nombre, direccion, correo, contacto, rtn) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                    [object.cliente_fact.cliente, object.cliente_fact.direccion, object.cliente_fact.correo, object.cliente_fact.contacto, object.cliente_fact.rtn])
                }
            }).then(async res => {
                console.log(res)
                await object.items_fact.forEach(element => {
                    t.any(`UPDATE productos set cant_prod = cant_prod - $2 where nombre_prod = $1`, [ element.nombre, element.cant ])
                })
                return true
            }).then(res => {
                console.log(res)
                return t.any(`INSERT INTO facturacion (cliente_fact, total_fact, items_fact) VALUES ($1, $2, $3) RETURNING *`,
                    [object.cliente_fact, object.total_fact, JSON.stringify(object.items_fact)])
            })
        }).then(res => {
            console.log(res)
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
            ).then(res => {
                if (res.length > 0) {
                    res[0].items_fact.forEach(element => {
                        t.any(`UPDATE productos set cant_prod = cant_prod + $2 where nombre_prod = $1`, [ element.nombre, element.cant ])
                    })
                    return true
                } else {
                    return false
                }
            })
        }).then(res => {
            resp.status(200).send({status: res, mgs: res ? `Factura eliminada exitosamente!` : `No se pudo eliminar la factura!` })
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}