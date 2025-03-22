// src/server.ts

// * Imports * //

// External imports
import 'dotenv/config'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mysql from 'mysql2/promise'

// Internal imports
import { router as rootRouter } from './routes/root.route.js'
import logger from './middleware/logger.js'
import { SCRIPT_DIR, VIEWS_DIR } from './constants.js'
import { PORT, HOST, PROTOCOL } from './constants.js'
import errorHandler from './middleware/errorHandler.js'
import corsOptions from './config/corsOptions.ts'

// * Database setup * //
export const connection = mysql
    .createConnection(process.env.DATABASE_URL!)
    .then(() => {
        console.log('Connected to database')
    })

// * Express App setup * //
const app = express()

// * Middleware * //

// Logger
app.use(logger)

// CORS
app.use(cors(corsOptions))

// JSON
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

// Public static files
app.use('/', express.static(path.join(SCRIPT_DIR, '../public')))

// Home/Root route
app.use('/', rootRouter)

// 404 route
app.use('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(VIEWS_DIR, '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Error Handler
app.use(errorHandler)

// * Server setup * //
app.listen(PORT, () =>
    console.log(`Server running on ${PROTOCOL}://${HOST}:${PORT}`)
)
