import { conexionDBPGP } from '../db/dbConfig.js'
import { handleHttpError } from '../utils/handleError.js'

export const getGastos = async(req, resp) => {
    try {
        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`select o.*, t.descripcion as tipo_desc, c.descripcion as cat_desc
                    from operaciones o
                    inner join tipo_operacion t on o.tipo = t.id
                    inner join categorias c on o.categoria = c.id ORDER BY o.id ASC`,
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

export const getGastosByDate = async(req, resp) => {
    try {
        const fecha = req.params.fecha

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`select o.*, t.descripcion as tipo_desc, c.descripcion as cat_desc
                    from operaciones o
                    inner join tipo_operacion t on o.tipo = t.id
                    inner join categorias c on o.categoria = c.id
                    where o.fecha_op = $1 ORDER BY o.id ASC`, [fecha]
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

export const createGastos = async(req, resp) => {
    try {
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`INSERT INTO operaciones (descripcion, valor, cantidad, tipo, categoria, fecha_op, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [object.descripcion, object.valor, object.cantidad, object.tipo, object.categoria, object.fecha_op, object.total]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Operacion agregada exitosamente con ID: ${res[0].id}`, data: res[0]})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const updateGastos = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`UPDATE operaciones SET descripcion = $2, valor = $3, cantidad = $4, fecha_op = $5, total = $6 WHERE id = $1`,
                [id, object.descripcion, object.valor, object.cantidad, object.fecha_op, object.total]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `Operacion modificada exitosamente con ID: ${id}`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const deleteGastos = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`DELETE FROM operaciones WHERE id = $1 RETURNING *`,  [id]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `La Operacion ${res[0].descripcion} fue eliminada exitosamente!` , data: res[0]})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}