import express from 'express'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import cors from 'cors'
import { AccountRouter, AdminRouter, UserRouter } from '../routers'
import { AccessController } from '../controllers'
import cookieParser from 'cookie-parser'
import { handleError } from '../errors'

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/account', AccountRouter)

// Authenticated routes
app.use(AccessController.isAuthenticated as RequestHandler)
app.use('/api/v1/users', UserRouter)

// Admin routes
app.use(AccessController.isAdmin as RequestHandler)
app.use('/api/v1/admin', AdminRouter)

app.use(handleError as ErrorRequestHandler)

export default app
