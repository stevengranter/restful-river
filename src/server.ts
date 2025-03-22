// src/server.ts

// * Imports * //

// External imports
import 'dotenv/config'
import express from 'express'
import path from 'path'

// Internal imports
import { router as rootRouter } from './routes/root.route.js'
import logger from './middleware/logger.js'
import { SCRIPT_DIR, VIEWS_DIR } from './constants.js'
import { PORT, HOST, PROTOCOL } from './constants.js'

// * App setup * //
const app = express()

// * Middleware * //

// Logger
app.use(logger)

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
        res.json({ message: '404 Not Founf' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// * Server setup * //
app.listen(PORT, () =>
    console.log(`Server running on ${PROTOCOL}://${HOST}:${PORT}`)
)
