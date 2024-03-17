import { Router } from 'express'
import type { RequestHandler } from 'express'
import { UserController } from '../controllers'
import { UserValidation } from '../validation'

const router = Router()

router.put('/', UserValidation.ValidateUserUpdate, UserController.updateUser as RequestHandler)

export default router
