import { conexionDBPGP } from '../db/dbConfig.js'
import { handleHttpError } from '../utils/handleError.js'

export const getGastosByYear = async(req, resp) => {
    try {
        const year = parseInt(req.params.year)
        const yearStart = year + '-01-01'
        const yearEnd = year + '-12-31'

        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`SELECT date_trunc('month', fecha_op)::date AS fecha,
                        date_part('month', fecha_op) AS mes,
                        sum(valor) FILTER (WHERE tipo = 1) AS ingresos,
                        sum(valor) FILTER (WHERE tipo = 2) AS gastos,
                        sum(valor)::float as total
                        FROM operaciones where fecha_op between $1 and $2 GROUP BY fecha, mes order by fecha asc`, [yearStart, yearEnd]
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

export const getYears = async(req, resp) => {
    try {
        // ✅ Crea el cliente
        const clientDBPGP = conexionDBPGP()

        // ✅ Se conecta a PGP
        clientDBPGP.tx(t => {
            return t.any(`select date_part('year', generate_series('2000-01-01', now(), '1 year')) as year order by year desc`
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