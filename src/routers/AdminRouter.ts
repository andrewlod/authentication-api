import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AdminController } from '../controllers'
import { DatabaseMiddlewares } from '../middlewares'
import { AdminValidation } from '../validation'

const router = Router()

router.get('/users', AdminController.getAllUsers as RequestHandler)

router.put('/users/:id', AdminValidation.ValidateAdminUserUpdate, DatabaseMiddlewares.checkEmailExists('email'), AdminController.adminUpdateUser as RequestHandler)

router.delete('/users/:id', AdminController.adminDeleteUser as RequestHandler)

export default router
