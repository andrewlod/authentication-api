import { Router } from 'express'
import type { RequestHandler } from 'express'
import { ValidateAccountCreation } from '../validation'
import { AccountController } from '../controllers'

const router = Router()

router.post('/register', ValidateAccountCreation, AccountController.register as RequestHandler)
router.post('/login', ValidateAccountCreation, AccountController.login as RequestHandler)

export default router
