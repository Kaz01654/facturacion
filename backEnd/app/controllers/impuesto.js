import { conexionDBPGP } from '../db/dbConfig.js'
import { handleHttpError } from '../utils/handleError.js'

export const getImpuesto = async(req, resp) => {
    try {
        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`SELECT * FROM IMPUESTO ORDER BY id ASC`,
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

export const createImpuesto = async(req, resp) => {
    try {
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`INSERT INTO IMPUESTO (descripcion, impuesto) VALUES ($1, $2) RETURNING *`, [object.descripcion, object.impuesto]
            )
        }).then(res => {
            resp.status(201).send({status: true, mgs: `Impuesto agregado exitosamente con ID: ${res[0].id}`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const updateImpuesto = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const { object } = req.body

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`UPDATE IMPUESTO SET descripcion = $2, impuesto = $3 WHERE id = $1`, [id, object.descripcion, object.impuesto]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `Impuesto actualizado exitosamente con ID: ${id}`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}

export const deleteImpuesto = async(req, resp) => {
    try {
        const id = parseInt(req.params.id)

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
                return t.any(`DELETE FROM IMPUESTO WHERE id = $1 RETURNING *`, [id]
            )
        }).then(res => {
            resp.status(200).send({status: true, mgs: `El Impuesto ${res[0].descripcion} fue eliminado exitosamente!`})
        }).catch(err => {
            handleHttpError(resp, err.message, err.statusCode)
        }).finally(() => {
            clientDBPGP.$pool.end()
        })
    } catch (err) {
        handleHttpError(resp, err.message, err.statusCode)
    }
}