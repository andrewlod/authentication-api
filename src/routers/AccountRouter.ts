import { Router } from 'express'
import type { RequestHandler } from 'express'
import { AccountValidation } from '../validation'
import { AccountController } from '../controllers'

const router = Router()

router.post('/register', AccountValidation.ValidateAccountCreation, AccountController.register as RequestHandler)
router.post('/login', AccountValidation.ValidateAccountCreation, AccountController.login as RequestHandler)

export default router
