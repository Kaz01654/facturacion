/**
 * @author David Alexis <alexis06sc2@gmail.com>
 */
import dotenv from 'dotenv'
import express, { json } from 'express'
import { logger, loggerCon } from './app/utils/logger.js'
import RouteLoader from './routeLoader.js'
import cors from 'cors'
dotenv.config()

const app = express()
const routes = await RouteLoader('./app/routes/*.js')
const port = process.env.PORT || 3000
const name = process.env.APP || 'Planner'

// ✅ Recomendación del principio 'Need to know'
app.disable('x-powered-by')

// ✅ Intercambio de recursos de origen cruzado
app.use(cors())

// ✅ Parsea el cuerpo de las peticiones (JSON)
app.use(json())

// ✅ REST API
app.use('/api', routes)

// ✅ Escucha del REST API
const server = app.listen(port, () => {
    logger.info(`Server ${name} running and listening on port: ${port}.`)
    loggerCon.info(`Server ${name} running and listening on port: ${port}.`)
})

// ✅ Manejando señales
function signalHandler(signal) {
    server.close(() => {
        logger.warn(`Receive signal: ${signal}, Server Close`)
        loggerCon.warn(`Receive signal: ${signal}, Server Close`)
        process.exit(0)
    })
}

process.on('SIGINT', signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)
process.on('SIGBREAK', signalHandler)