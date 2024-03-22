import { Router } from 'express'
import type { RequestHandler } from 'express'
import { UserController } from '../controllers'
import { UserValidation } from '../validation'
import { DatabaseMiddlewares, RouteMiddlewares } from '../middlewares'

const router = Router()

router.put('/', UserValidation.ValidateUserUpdate, DatabaseMiddlewares.checkEmailExists('email'), UserController.updateUser as RequestHandler)

router.delete('/', UserController.deleteUser as RequestHandler)

router.get('/logout', UserController.logout as RequestHandler)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
