import path from 'node:path'
import { getGastosByYear, getYears } from '../controllers/graficas.js'

const filename = path.basename(import.meta.url, '.js')

export default function (router) {
    router.get(`/${filename}/getGastosByYear/:year`, getGastosByYear)
    router.get(`/${filename}/getYears/`, getYears)
    return router
}