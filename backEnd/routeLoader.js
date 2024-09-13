import { Router } from 'express'
import glob from 'fast-glob'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger, loggerCon } from './app/utils/logger.js'

const BASE_DIR = dirname(fileURLToPath(import.meta.url))

export default async function RouteLoader(globPattern) {
    let router = Router()
    let files = []
    try {
        files = await glob(globPattern, { cwd: BASE_DIR })
    } catch (err) {
        logger.error(err.message)
        loggerCon.error(err.message)
    }

    for (const file of files) {
        if (fs.statSync(file).isFile() && path.extname(file).toLowerCase() === '.js') {
            try {
                const routeModule = await import(file)
                router = (routeModule.default || routeModule)(router)
            } catch (err) {
                logger.error(`Error when loading route file: ${file} [ ${err.toString()} ]`)
                loggerCon.error(`Error when loading route file: ${file} [ ${err.toString()} ]`)
                throw new Error(`Error when loading route file: ${file} [ ${err.toString()} ]`)
            }
        }
    }
    return router
}