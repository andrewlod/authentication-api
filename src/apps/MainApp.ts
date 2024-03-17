import express from 'express'
import type { RequestHandler } from 'express'
import cors from 'cors'
import { AccountRouter, UserRouter } from '../routers'
import { AccessController } from '../controllers'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1/account', AccountRouter)

// Authenticated routes
app.use(AccessController.isAuthenticated as RequestHandler)

app.use('/api/v1/users', UserRouter)

export default app
