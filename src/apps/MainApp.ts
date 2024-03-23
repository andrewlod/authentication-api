import express, { Router } from 'express'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerOutput from '../docs/swagger_output.json'
import cors from 'cors'
import { AccountRouter, AdminRouter, ApiInfoRouter, UserRouter } from '../routers'
import { AccessController } from '../controllers'
import cookieParser from 'cookie-parser'
import { handleError } from '../errors'
import helmet from 'helmet'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())

const v1Router = Router()

v1Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))
v1Router.use('/api-info', ApiInfoRouter)
v1Router.use('/account', AccountRouter)

// Authenticated routes
v1Router.use(AccessController.isAuthenticated as RequestHandler)
v1Router.use('/users', UserRouter)

// Admin routes
v1Router.use(AccessController.isAdmin as RequestHandler)
v1Router.use('/admin', AdminRouter)

app.use('/api/v1', v1Router)

app.use(handleError as ErrorRequestHandler)

export default app
