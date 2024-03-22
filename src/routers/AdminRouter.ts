import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AdminController } from '../controllers'
import { DatabaseMiddlewares, RouteMiddlewares } from '../middlewares'
import { AdminValidation } from '../validation'

const router = Router()

router.get('/users', AdminController.getAllUsers as RequestHandler)
router.get('/users/:id', AdminValidation.ValidateAdminUserGet, AdminController.getUser as RequestHandler)

router.put('/users/:id', AdminValidation.ValidateAdminUserUpdate, DatabaseMiddlewares.checkEmailExists('email'), AdminController.adminUpdateUser as RequestHandler)

router.delete('/users/:id', AdminController.adminDeleteUser as RequestHandler)

router.use('*', RouteMiddlewares.routeNotFound)

export default router
