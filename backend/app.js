import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './router/routers.js'
import path from "path"
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(cors())

app.use(cookieParser())

app.use(router)
export default app