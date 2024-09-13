import { logger, loggerCon } from './logger.js'
export const handleHttpError = (res, msg, code = 403) => {
    logger.error(msg)
    loggerCon.error(msg)
    res.status(code).send({ status: code, error: msg})
}