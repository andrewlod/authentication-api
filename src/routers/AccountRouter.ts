import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AccountValidation } from '../validation'
import { AccountController } from '../controllers'
import { RouteMiddlewares } from '../middlewares'

const router = Router()

router.post('/register', AccountValidation.ValidateAccountCreation, AccountController.register as RequestHandler)
router.post('/login', AccountValidation.ValidateAccountCreation, AccountController.login as RequestHandler)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
